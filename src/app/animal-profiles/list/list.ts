import {
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  inject,
  model,
  viewChild,
  computed,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridRowDeleteConfirmArgs, SkyAgGridService } from '@skyux/ag-grid';
import { SkyAvatarModule } from '@skyux/avatar';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyFlyoutService } from '@skyux/flyout';
import { SkyIconModule } from '@skyux/icon';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyButton } from '@skyux/forms';

import { AgGridAngular } from 'ag-grid-angular';
import {
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  CustomEditorModule,
  EventApiModule,
  GridOptions,
  IRowNode,
  LocaleModule,
  ModuleRegistry,
  RenderApiModule,
  RowApiModule,
  RowSelectionModule,
  RowStyleModule,
} from 'ag-grid-community';
import { distinctUntilChanged, map, takeUntil } from 'rxjs';

import { Data } from '../../services/data/data';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';
import { EditModal } from '../edit/edit-modal';
import { parentLink } from '../parent-link';

import { LINK_TO_VIEW, View } from '../view/view';

import { buildColumnDefs, buildDefaultDataState } from './list-config';

ModuleRegistry.registerModules([
  CellStyleModule,
  ClientSideRowModelModule,
  ColumnApiModule,
  ColumnAutoSizeModule,
  CustomEditorModule,
  EventApiModule,
  LocaleModule,
  RenderApiModule,
  RowApiModule,
  RowSelectionModule,
  RowStyleModule,
]);

@Component({
  selector: 'app-list',
  imports: [
    AgGridAngular,
    SkyAgGridModule,
    SkyAvatarModule,
    SkyButton,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyPageModule,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List implements OnInit {
  public rowDeleteIds = model<string[]>([]);

  protected gridOptions: GridOptions<AnimalProfile> | undefined;
  protected readonly parentLink = parentLink;
  protected readonly grid = viewChild(AgGridAngular);
  protected readonly menuTemplate = viewChild<TemplateRef<unknown>>('menuTemplate');
  protected readonly avatarTemplate = viewChild<TemplateRef<unknown>>('avatarTemplate');
  protected readonly starTemplate = viewChild<TemplateRef<unknown>>('starTemplate');
  protected readonly linkTemplate = viewChild<TemplateRef<unknown>>('linkTemplate');
  protected readonly rows = computed(() => {
    const searchText = this.searchText().toLocaleLowerCase().trim();
    return this.#data().filter(({ name, bio, gender, breed }) =>
      [name, bio, gender, breed].some((value) => value.toLocaleLowerCase().includes(searchText)),
    );
  });

  readonly #confirmService = inject(SkyConfirmService);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #dataService = inject(Data);
  readonly #data = this.#dataService.list;
  readonly #destroy = inject(DestroyRef);
  readonly #editModal = inject(EditModal);
  readonly #flyoutService = inject(SkyFlyoutService);
  readonly #gridService = inject(SkyAgGridService);
  readonly #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    searchEnabled: true,
  };

  protected readonly searchText = toSignal(
    this.#dataManagerService.getDataStateUpdates(this.#viewConfig.id).pipe(
      map((dataState) => dataState.searchText ?? ''),
      distinctUntilChanged(),
    ),
    { initialValue: '' },
  );

  public ngOnInit(): void {
    const cols = buildColumnDefs({
      menuTemplate: this.menuTemplate(),
      avatarTemplate: this.avatarTemplate(),
      starTemplate: this.starTemplate(),
      linkTemplate: this.linkTemplate(),
    });
    this.gridOptions = this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs: cols,
        autoSizeStrategy: {
          type: 'fitGridWidth',
        },
        rowSelection: {
          mode: 'singleRow',
        },
      },
    });

    this.#dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: {
        listDescriptor: 'Animal Profiles',
      },
      defaultDataState: buildDefaultDataState(cols),
      settingsKey: 'list-settings',
    });

    this.#dataManagerService.initDataView(this.#viewConfig);
  }

  public onViewClick(id: string, name: string): void {
    const rowNode = this.grid()?.api.getRowNode(id);
    rowNode?.setSelected(true);
    const index = rowNode?.rowIndex ?? Number.POSITIVE_INFINITY;
    const previousRow = this.grid()?.api.getDisplayedRowAtIndex(index - 1);
    const nextRow = this.grid()?.api.getDisplayedRowAtIndex(index + 1);
    const flyout = this.#flyoutService.open(View, {
      primaryAction: {
        label: 'Edit',
        callback: () => this.onEditClick(id),
      },
      ariaLabel: `Record for ${name}`,
      providers: [
        {
          provide: ID,
          useValue: id,
        },
        {
          provide: LINK_TO_VIEW,
          useValue: true,
        },
      ],
      maxWidth: undefined,
      settingsKey: 'view-flyout',
      showIterator: true,
      iteratorNextButtonDisabled: !nextRow,
      iteratorPreviousButtonDisabled: !previousRow,
    });
    flyout.iteratorNextButtonClick
      .pipe(takeUntilDestroyed(this.#destroy), takeUntil(flyout.closed))
      .subscribe(() => {
        this.navigateFlyoutToRow(nextRow);
      });
    flyout.iteratorPreviousButtonClick
      .pipe(takeUntilDestroyed(this.#destroy), takeUntil(flyout.closed))
      .subscribe(() => {
        this.navigateFlyoutToRow(previousRow);
      });
  }

  public navigateFlyoutToRow(row: IRowNode<AnimalProfile> | undefined): void {
    if (row?.id && row?.data?.name) {
      this.onViewClick(row.id, row.data.name);
    }
  }

  public onEditClick(id?: string): void {
    this.#editModal.edit(id);
  }

  public onDeleteClick(id: string): void {
    this.rowDeleteIds.update((ids) => [...new Set(ids.concat([id]))]);
  }

  public toggleNeedsAttention<T extends Pick<AnimalProfile, 'id'>>(row: T): void {
    this.#dataService.toggleNeedsAttention(row.id);
  }

  public rowDeleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.rowDeleteIds.update((ids) => ids.filter((id) => id !== $event.id));
    this.#dataService.delete($event.id);
  }

  protected onReset(): void {
    const confirm = this.#confirmService.open({
      type: SkyConfirmType.Custom,
      body: `Are you sure you want to reset the data? This will clear changes in
       local storage and reload data from the server.`,
      buttons: [
        {
          styleType: 'primary',
          text: 'Reset data',
          action: 'reset',
        },
        {
          text: 'Cancel',
          action: 'cancel',
        },
      ],
      message: 'Reset Data',
    });
    confirm.closed.pipe(takeUntilDestroyed(this.#destroy)).subscribe((result) => {
      if (result.action === 'reset') {
        this.#dataService.resetData();
      }
    });
  }
}

export default List;
