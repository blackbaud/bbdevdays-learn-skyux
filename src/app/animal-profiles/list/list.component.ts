import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  Signal,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import {
  SkyAgGridModule,
  SkyAgGridRowDeleteCancelArgs,
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
import { SkyIconModule, SkyWaitModule } from '@skyux/indicators';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';

import { AgGridAngular, AgGridModule } from 'ag-grid-angular';
import { ColDef, GridOptions } from 'ag-grid-community';
import { distinctUntilChanged, map } from 'rxjs';

import { DataService } from '../../services/data/data.service';
import { SETTINGS } from '../../settings';
import { ID } from '../../types/id';
import { PersistenceService } from '../../services/data/persistence.service';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { ViewComponent } from '../view/view.component';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    AgGridModule,
    CommonModule,
    RouterLink,
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
  styleUrls: ['./list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements OnInit {
  protected readonly data: Signal<AnimalProfileRow[] | undefined>;
  protected gridOptions: GridOptions<AnimalProfileRow> | undefined;
  protected readonly loading: Signal<boolean | undefined>;
  protected readonly parentLink = parentLink;
  protected rowDeleteIds: string[] = [];
  protected readonly settings = SETTINGS.animalProfiles;

  @ViewChild(AgGridAngular, { static: true })
  protected grid: AgGridAngular | undefined;

  @ViewChild('avatarTemplate', { static: true })
  protected avatarTemplate: TemplateRef<unknown> | undefined;

  @ViewChild('contextMenuTemplate', { static: true })
  protected contextMenuTemplate: TemplateRef<unknown> | undefined;

  @ViewChild('linkTemplate', { static: true })
  protected linkTemplate: TemplateRef<unknown> | undefined;

  readonly #columnDefs: () => ColDef<AnimalProfileRow>[] = () => [
    {
      headerName: '',
      field: 'menu',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.contextMenuTemplate,
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      headerName: '',
      field: 'image',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.avatarTemplate,
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      headerName: '🐶',
      field: 'needsAttention',
      cellDataType: 'text',
      valueFormatter: (params): string => (params.value ? '🐶' : ''),
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
    },
    {
      field: 'name',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: this.linkTemplate,
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
    this.loading = toSignal(this.#persistenceService.loading);
    this.data = toSignal(
      this.#dataService.list.pipe(
        map((rows) =>
          rows.map(
            (row) =>
              ({
                selected: false,
                menu: true,
                image: true,
                ...row,
              }) as AnimalProfileRow,
          ),
        ),
      ),
    );
  }

  public ngOnInit(): void {
    this.gridOptions = this.#gridService.getGridOptions({
      gridOptions: {
        columnDefs: this.#columnDefs(),
        rowSelection: 'single',
      },
    });

    this.#dataManagerService.initDataManager({
      activeViewId: 'gridView',
      dataManagerConfig: {
        listDescriptor: SETTINGS.animalProfiles.title,
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
        this.grid?.api?.setGridOption('quickFilterText', searchText);
      });
  }

  protected onViewClick(id: string, ariaLabel: string): void {
    this.grid?.api.getRowNode(id)?.setSelected(true);
    this.#flyoutService.open(ViewComponent, {
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
      ariaLabel,
      providers: [
        {
          provide: ID,
          useValue: id,
        },
      ],
    });
  }

  protected onEditClick(id?: string): void {
    this.#editService.edit(id);
  }

  protected onDeleteClick(id: string): void {
    this.rowDeleteIds = [...new Set([...this.rowDeleteIds, id])];
  }

  protected rowDeleteCancel($event: SkyAgGridRowDeleteCancelArgs): void {
    this.rowDeleteIds = this.rowDeleteIds.filter((id) => id !== $event.id);
  }

  protected rowDeleteConfirm($event: SkyAgGridRowDeleteConfirmArgs): void {
    this.rowDeleteIds = this.rowDeleteIds.filter((id) => id !== $event.id);
    this.#dataService.delete($event.id);
  }

  protected onReset() {
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
}
