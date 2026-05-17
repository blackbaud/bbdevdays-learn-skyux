import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  TemplateRef,
  effect,
  inject,
  model,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAgGridModule, SkyAgGridRowDeleteConfirmArgs, SkyAgGridService } from '@skyux/ag-grid';
import { SkyAvatarModule } from '@skyux/avatar';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataViewConfig,
} from '@skyux/data-manager';
import { SkyFlyoutService } from '@skyux/flyout';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import {
  AllCommunityModule,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  ModuleRegistry,
} from 'ag-grid-community';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs';

import { Data } from '../../services/data/data';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { ID } from '../../types/id';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';
import { EDIT_ACTION, LINK_TO_VIEW, View } from '../view/view';

import { buildColumnDefs, buildDefaultDataState } from './list-config';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-list',
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyAvatarModule,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyPageModule,
    SkyWaitModule,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './list.html',
  styleUrl: './list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class List implements OnInit {
  rowDeleteIds = model<string[]>([]);

  protected gridOptions: GridOptions<AnimalProfileRow> | undefined;
  protected readonly parentLink = parentLink;
  protected readonly grid = viewChild(AgGridAngular);
  protected readonly avatarTemplate = viewChild<TemplateRef<unknown>>('avatarTemplate');
  protected readonly starTemplate = viewChild<TemplateRef<unknown>>('starTemplate');
  protected readonly linkTemplate = viewChild<TemplateRef<unknown>>('linkTemplate');
  protected readonly loading = inject(Data).loading;

  readonly #confirmService = inject(SkyConfirmService);
  readonly #dataManagerService = inject(SkyDataManagerService);
  readonly #dataService = inject(Data);
  readonly #destroy = inject(DestroyRef);
  readonly #editService = inject(EditService);
  readonly #flyoutService = inject(SkyFlyoutService);
  readonly #gridApi = signal<GridApi<AnimalProfileRow> | undefined>(undefined);
  readonly #gridService = inject(SkyAgGridService);
  readonly #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    searchEnabled: true,
  };

  constructor() {
    effect(() => {
      const gridApi = this.#gridApi();
      if (!gridApi) return;
      const data = this.#dataService.list().map(
        (row) =>
          ({
            selected: false,
            menu: true,
            image: true,
            ...row,
          }) as AnimalProfileRow,
      );
      gridApi.setGridOption('rowData', data);
    });
  }

  public ngOnInit(): void {
    const cols = buildColumnDefs({
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

    this.#dataManagerService
      .getDataStateUpdates(this.#viewConfig.id)
      .pipe(
        takeUntilDestroyed(this.#destroy),
        map((dataState) => dataState.searchText ?? ''),
        distinctUntilChanged(),
      )
      .subscribe((searchText) => {
        this.grid()?.api?.setGridOption('quickFilterText', searchText);
      });
  }

  public onViewClick(id: string, name: string): void {
    const rowNode = this.grid()?.api.getRowNode(id);
    rowNode?.setSelected(true);
    const index = rowNode?.rowIndex ?? Number.POSITIVE_INFINITY;
    const previousRow = this.grid()?.api.getDisplayedRowAtIndex(index - 1);
    const nextRow = this.grid()?.api.getDisplayedRowAtIndex(index + 1);
    const editAction = () => this.onEditClick(id);
    const flyout = this.#flyoutService.open(View, {
      primaryAction: {
        label: 'Edit',
        callback: editAction,
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
        {
          provide: EDIT_ACTION,
          useValue: editAction,
        },
      ],
      maxWidth: undefined,
      settingsKey: 'view-flyout',
      showIterator: true,
      iteratorNextButtonDisabled: !nextRow,
      iteratorPreviousButtonDisabled: !previousRow,
    });
    // Rather than complicating the test further, we ignore this and run a separate test for `focusOnRow`.
    /* istanbul ignore next */
    flyout.iteratorNextButtonClick
      .pipe(
        filter(() => !!nextRow),
        takeUntilDestroyed(this.#destroy),
        takeUntil(flyout.closed),
      )
      .subscribe(() => {
        this.focusOnRow(index + 1, nextRow!);
      });
    /* istanbul ignore next */
    flyout.iteratorPreviousButtonClick
      .pipe(
        filter(() => !!previousRow),
        takeUntilDestroyed(this.#destroy),
        takeUntil(flyout.closed),
      )
      .subscribe(() => {
        this.focusOnRow(index - 1, previousRow!);
      });
  }

  public focusOnRow(nextIndex: number, nextRow: IRowNode<AnimalProfileRow>): void {
    if (nextRow?.id && nextRow?.data?.name) {
      this.onViewClick(nextRow.id, nextRow.data.name);
    }
  }

  public onEditClick(id?: string): void {
    this.#editService.edit(id);
  }

  public onDeleteClick(id: string): void {
    this.rowDeleteIds.update((ids) => [...new Set(ids.concat([id]))]);
  }

  public toggleNeedsAttention<T extends Pick<AnimalProfileRow, 'id'>>(row: T): void {
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

  protected gridReady($event: GridReadyEvent<AnimalProfileRow>): void {
    this.#gridApi.set($event.api);
  }
}

export default List;
