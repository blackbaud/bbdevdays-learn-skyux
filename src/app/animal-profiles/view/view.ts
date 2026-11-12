import { Component, computed, inject, input, InjectionToken } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyDatePipeModule } from '@skyux/datetime';
import { SkyErrorModule } from '@skyux/errors';
import { SkyIconModule } from '@skyux/icon';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyBoxModule, SkyDescriptionListModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageHeaderModule, SkyPageModule } from '@skyux/pages';
import { SkyButton } from '@skyux/forms';

import { Data } from '../../services/data/data';
import { ID } from '../../types/id';
import { EditModal } from '../edit/edit-modal';
import { parentLink } from '../parent-link';

import { Age } from './age/age';

export const LINK_TO_VIEW = new InjectionToken<boolean>('LINK_VIEW_TITLE');

@Component({
  selector: 'app-view',
  imports: [
    Age,
    RouterLink,
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyButton,
    SkyDatePipeModule,
    SkyDescriptionListModule,
    SkyErrorModule,
    SkyFluidGridModule,
    SkyIconModule,
    SkyPageHeaderModule,
    SkyPageModule,
  ],
  styleUrl: './view.css',
  templateUrl: './view.html',
})
export class View {
  public readonly id = input<string>(inject(ID, { optional: true }) ?? '');

  readonly #dataService = inject(Data);
  readonly #editModal = inject(EditModal);
  protected readonly linkToView = !!inject(LINK_TO_VIEW, { optional: true });
  protected readonly parentLink = this.linkToView ? undefined : parentLink;

  protected readonly dataOrUndefined = computed(() => {
    if (this.#dataService.loading()) {
      return undefined;
    }
    const id = this.id();
    return id && this.#dataService.get(id)();
  });

  protected onEditClick(id: string): void {
    this.#editModal.edit(id);
  }
}
