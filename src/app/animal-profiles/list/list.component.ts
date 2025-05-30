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

import { DataService } from '../../services/data/data.service';
import { PersistenceService } from '../../services/data/persistence.service';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { ID } from '../../types/id';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';
import { ViewComponent } from '../view/view.component';

import { ContextMenuComponent } from './context-menu/context-menu.component';

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
  templateUrl: './list.component.html',
  styleUrl: './list.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  rowDeleteIds = model<string[]>([]);

  protected gridOptions: GridOptions<AnimalProfileRow> | undefined;
  protected parentLink = parentLink;
  protected grid = viewChild(AgGridAngular);
  protected avatarTemplate = viewChild<TemplateRef<unknown>>('avatarTemplate');
  protected flagTemplate = viewChild<TemplateRef<unknown>>('flagTemplate');
  protected linkTemplate = viewChild<TemplateRef<unknown>>('linkTemplate');
  protected loading = inject(PersistenceService).loading;

  #columnDefs: () => ColDef<AnimalProfileRow>[] = () => [
    {
      field: 'menu',
      type: SkyCellType.Template,
      headerComponentParams: {
        headerHidden: true,
      },
      cellRenderer: ContextMenuComponent,
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
      headerName: '🚩',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.flagTemplate(),
      },
      field: 'needsAttention',
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
  #confirmService = inject(SkyConfirmService);
  #dataManagerService = inject(SkyDataManagerService);
  #dataService = inject(DataService);
  #destroy = inject(DestroyRef);
  #editService = inject(EditService);
  #flyoutService = inject(SkyFlyoutService);
  #gridApi = signal<GridApi<AnimalProfileRow> | undefined>(undefined);
  #gridService = inject(SkyAgGridService);
  #persistenceService = inject(PersistenceService);
  #viewConfig: SkyDataViewConfig = {
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
    const flyout = this.#flyoutService.open(ViewComponent, {
      permalink: {
        label: `↗️`,
        route: {
          commands: ['animal-profiles', 'view', id],
        },
      },
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
      ],
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

  public focusOnRow(
    nextIndex: number,
    nextRow: IRowNode<AnimalProfileRow>,
  ): void {
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

  public toggleNeedsAttention(id: string): void {
    this.#dataService.toggleNeedsAttention(id);
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
    confirm.closed
      .pipe(takeUntilDestroyed(this.#destroy))
      .subscribe((result) => {
        if (result.action === 'reset') {
          this.#persistenceService.resetData();
        }
      });
  }

  protected gridReady($event: GridReadyEvent<AnimalProfileRow>): void {
    this.#gridApi.set($event.api);
  }
}

export default ListComponent;
