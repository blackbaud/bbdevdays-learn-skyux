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
import {
  SkyAgGridModule,
  SkyAgGridRowDeleteConfirmArgs,
  SkyAgGridService,
  SkyCellType,
} from '@skyux/ag-grid';
import { SkyAvatarModule } from '@skyux/avatar';
import {
  SkyDataManagerModule,
  SkyDataManagerService,
  SkyDataManagerState,
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
  ColDef,
  GridApi,
  GridOptions,
  GridReadyEvent,
  IRowNode,
  ModuleRegistry,
} from 'ag-grid-community';
import { distinctUntilChanged, map, takeUntil, takeWhile } from 'rxjs';

import { Data } from '../../services/data/data';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { ID } from '../../types/id';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';
import { EDIT_ACTION, LINK_TO_VIEW, View } from '../view/view';

import { ContextMenu } from './context-menu/context-menu';

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

  readonly #columnDefs: () => ColDef<AnimalProfileRow>[] = () => [
    {
      field: 'menu',
      type: SkyCellType.Template,
      headerComponentParams: {
        headerHidden: true,
      },
      cellRenderer: ContextMenu,
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      field: 'image',
      type: SkyCellType.Template,
      headerComponentParams: {
        headerHidden: true,
      },
      cellRendererParams: {
        template: this.avatarTemplate(),
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      headerName: 'Needs attention?',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.starTemplate(),
      },
      field: 'needsAttention',
      headerComponentParams: {
        headerHidden: true,
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
    },
    {
      field: 'name',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.linkTemplate(),
      },
      initialSort: 'asc',
    },
    {
      field: 'gender',
    },
    {
      field: 'breed',
    },
    {
      field: 'birthdate',
      type: SkyCellType.Date,
    },
  ];
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
      const data = this.#dataService.list().map(
        (row) =>
          ({
            selected: false,
            menu: true,
            image: true,
            ...row,
          }) as AnimalProfileRow,
      );
      const gridApi = this.#gridApi();
      gridApi?.setGridOption('rowData', data);
    });
  }

  public ngOnInit(): void {
    this.gridOptions = this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs(),
        domLayout: 'normal',
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
      defaultDataState: new SkyDataManagerState({
        activeSortOption: {
          id: 'name',
          label: 'Name',
          descending: false,
          propertyName: 'name',
        },
        views: [
          {
            viewId: 'gridView',
            displayedColumnIds: this.#columnDefs()
              .filter((col) => col.field)
              .map((col) => col.field) as string[],
          },
        ],
      }),
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
        takeWhile(() => !!nextRow),
        takeUntilDestroyed(this.#destroy),
        takeUntil(flyout.closed),
      )
      .subscribe(() => {
        this.focusOnRow(index + 1, nextRow!);
      });
    /* istanbul ignore next */
    flyout.iteratorPreviousButtonClick
      .pipe(
        takeWhile(() => !!previousRow),
        takeUntilDestroyed(this.#destroy),
        takeUntil(flyout.closed),
      )
      .subscribe(() => {
        this.focusOnRow(index - 1, previousRow!);
      });
  }

  public focusOnRow(nextIndex: number, nextRow: IRowNode<AnimalProfileRow>): void {
    if (nextRow?.id && nextRow?.data?.name) {
      this.grid()?.api.ensureIndexVisible(nextIndex, 'middle');
      this.onViewClick(nextRow.id, nextRow.data.name);
    }
  }

  public onEditClick(id?: string): void {
    this.#editService.edit(id);
  }

  public onDeleteClick(id: string): void {
    this.rowDeleteIds.update((ids) => [...new Set(ids.concat([id]))]);
  }

  public toggleNeedsAttention<T extends Pick<AnimalProfileRow, 'id' | 'needsAttention'>>(
    row: T,
  ): void {
    this.#dataService.toggleNeedsAttention(row.id);
    this.grid()?.api.applyTransaction({
      update: [
        {
          ...row,
          needsAttention: !row.needsAttention,
        },
      ],
    });
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
