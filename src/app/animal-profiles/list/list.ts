import { Component, DestroyRef, inject, model, computed } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyUIConfigService } from '@skyux/core';
import { SkyDataGrid, SkyDataGridColumn, SkyDataGridRowDeleteArgs } from '@skyux/data-grid';
import { SkyDataManagerModule } from '@skyux/data-manager';
import { SkyFlyoutService } from '@skyux/flyout';
import { SkyIconModule } from '@skyux/icon';
import { SkyConfirmService, SkyConfirmType } from '@skyux/modals';
import { SkyPageModule } from '@skyux/pages';
import { SkyDropdownModule } from '@skyux/popovers';
import { SkyButton } from '@skyux/forms';

import { takeUntil } from 'rxjs';

import { AppUIConfigService } from '../../services/app-ui-config/app-ui-config';
import { Data } from '../../services/data/data';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';

import { EditModal } from '../edit/edit-modal';
import { parentLink } from '../parent-link';
import { LINK_TO_VIEW, View } from '../view/view';

@Component({
  selector: 'app-list',
  imports: [
    SkyAvatarModule,
    SkyButton,
    SkyDataManagerModule,
    SkyDropdownModule,
    SkyIconModule,
    SkyPageModule,
    SkyDataGrid,
    SkyDataGridColumn,
  ],
  providers: [
    {
      provide: SkyUIConfigService,
      useClass: AppUIConfigService,
    },
  ],
  templateUrl: './list.html',
  styleUrl: './list.css',
})
export class List {
  public readonly rowDeleteIds = model<string[]>([]);
  public readonly search = model('');

  protected readonly selectedIds = model<string[]>([]);
  protected readonly parentLink = parentLink;
  protected readonly rows = computed(() => {
    const searchText = this.search()?.toLocaleLowerCase().trim() || '';
    return this.#data().filter(({ name, bio, gender, breed }) =>
      [name, bio, gender, breed].some((value) => value.toLocaleLowerCase().includes(searchText)),
    );
  });

  readonly #confirmService = inject(SkyConfirmService);
  readonly #dataService = inject(Data);
  readonly #data = this.#dataService.list;
  readonly #destroy = inject(DestroyRef);
  readonly #editModal = inject(EditModal);
  readonly #flyoutService = inject(SkyFlyoutService);

  readonly #selectedRow = computed(() => this.selectedIds().at(0));
  readonly #selectedIndex = computed(() => {
    const selectedRow = this.#selectedRow();
    return this.rows().findIndex((row) => row.id === selectedRow);
  });
  readonly #previousRow = computed(() => {
    const selectedIndex = this.#selectedIndex();
    if (selectedIndex > 0) {
      return this.rows().at(selectedIndex - 1);
    }
    return undefined;
  });
  readonly #nextRow = computed(() => {
    const selectedIndex = this.#selectedIndex();
    return this.rows().at(selectedIndex + 1);
  });

  public onViewClick(id: string, name: string): void {
    this.selectedIds.set([id]);
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
      iteratorNextButtonDisabled: !this.#nextRow(),
      iteratorPreviousButtonDisabled: !this.#previousRow(),
    });
    flyout.iteratorNextButtonClick.pipe(takeUntil(flyout.closed)).subscribe(() => {
      const row = this.#nextRow();
      /* istanbul ignore else -- @preserve */
      if (row) {
        this.onViewClick(row.id, row.name);
      }
    });
    flyout.iteratorPreviousButtonClick.pipe(takeUntil(flyout.closed)).subscribe(() => {
      const row = this.#previousRow();
      /* istanbul ignore else -- @preserve */
      if (row) {
        this.onViewClick(row.id, row.name);
      }
    });
    this.#destroy.onDestroy(() => flyout.close());
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

  public rowDeleteConfirm($event: SkyDataGridRowDeleteArgs): void {
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
