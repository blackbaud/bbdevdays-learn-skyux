import { Component, computed, inject, input, InjectionToken } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyDatePipeModule } from '@skyux/datetime';
import { SkyErrorModule } from '@skyux/errors';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageHeaderModule, SkyPageModule } from '@skyux/pages';

import { Data } from '../../services/data/data';
import { ID } from '../../types/id';

import { Age } from './age/age';
import { DescriptionListItem } from './description-list/description-list-item';
import { DescriptionList } from './description-list/description-list';
import { RouterLink } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { parentLink } from '../parent-link';

export const LINK_TO_VIEW = new InjectionToken<boolean>('LINK_VIEW_TITLE');
export const EDIT_ACTION = new InjectionToken<(id: string) => void>('EDIT_ACTION');

@Component({
  selector: 'app-view',
  imports: [
    Age,
    DescriptionList,
    DescriptionListItem,
    RouterLink,
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyDatePipeModule,
    SkyErrorModule,
    SkyFluidGridModule,
    SkyPageHeaderModule,
    SkyPageModule,
    SkyIconModule,
  ],
  styleUrl: './view.css',
  templateUrl: './view.html',
})
export class View {
  public readonly id = input<string>(inject(ID, { optional: true }) ?? '');

  readonly #dataService = inject(Data);
  protected readonly linkToView = !!inject(LINK_TO_VIEW, { optional: true });
  protected readonly edit = inject(EDIT_ACTION, { optional: true });
  protected readonly parentLink = this.linkToView ? undefined : parentLink;

  protected readonly dataOrUndefined = computed(() => {
    if (this.#dataService.loading()) {
      return undefined;
    }
    const id = this.id();
    return id && this.#dataService.get(id)();
  });
}
