import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  model,
  OnInit,
  signal,
  TemplateRef,
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
  ModuleRegistry,
} from 'ag-grid-community';
import { distinctUntilChanged, map } from 'rxjs';

import { DataService } from '../../services/data/data.service';
import { ID } from '../../types/id';
import { PersistenceService } from '../../services/data/persistence.service';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { ViewComponent } from '../view/view.component';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';
import { ContextMenuComponent } from './context-menu/context-menu.component';

ModuleRegistry.registerModules([AllCommunityModule]);

@Component({
  selector: 'app-list',
  imports: [
    AgGridModule,
    SkyAgGridModule,
    SkyDataManagerModule,
    SkyIconModule,
    SkyPageModule,
    SkyWaitModule,
    SkyDropdownModule,
    SkyAvatarModule,
  ],
  providers: [SkyDataManagerService],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  protected gridOptions: GridOptions<AnimalProfileRow> | undefined;
  protected readonly parentLink = parentLink;
  protected readonly rowDeleteIds = model<string[]>([]);
  protected readonly grid = viewChild(AgGridAngular);
  protected avatarTemplate = viewChild<TemplateRef<unknown>>('avatarTemplate');
  protected flagTemplate = viewChild<TemplateRef<unknown>>('flagTemplate');
  protected linkTemplate = viewChild<TemplateRef<unknown>>('linkTemplate');

  readonly #columnDefs: () => ColDef<AnimalProfileRow>[] = () => [
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
  readonly #dataService = inject(DataService);
  readonly #destroy = inject(DestroyRef);
  readonly #editService = inject(EditService);
  readonly #flyoutService = inject(SkyFlyoutService);
  readonly #gridApi = signal<GridApi<AnimalProfileRow> | undefined>(undefined);
  readonly #gridService = inject(SkyAgGridService);
  readonly #persistenceService = inject(PersistenceService);
  readonly #viewConfig: SkyDataViewConfig = {
    id: 'gridView',
    name: 'Grid View',
    searchEnabled: true,
    columnPickerEnabled: true,
    columnOptions: this.#columnDefs().map((col) => ({
      id: `${col.field}`,
      label: `${col.field}`,
      alwaysDisplayed: ['menu', 'image', 'needsAttention'].includes(
        `${col.field}`,
      ),
      initialHide: false,
    })),
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

  public onViewClick(id: string, ariaLabel: string): void {
    this.grid()?.api.getRowNode(id)?.setSelected(true);
    this.#flyoutService.open(ViewComponent, {
      permalink: {
        label: `↗️`,
        route: {
          commands: ['animal-profiles', 'view', id],
        },
      },
      primaryAction: {
        label: 'Edit',
        callback: () => {
          this.onEditClick(id);
        },
      },
      ariaLabel,
      providers: [
        {
          provide: ID,
          useValue: id,
        },
      ],
    });
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

  protected rowDeleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
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
