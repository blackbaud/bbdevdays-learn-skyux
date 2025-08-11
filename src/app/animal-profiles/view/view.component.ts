import {
  Component,
  booleanAttribute,
  computed,
  inject,
  input,
} from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyDatePipeModule } from '@skyux/datetime';
import { SkyErrorModule } from '@skyux/errors';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyBoxModule, SkyFluidGridModule } from '@skyux/layout';
import { SkyPageHeaderModule, SkyPageModule } from '@skyux/pages';

import { DataService } from '../../services/data/data.service';
import { PersistenceService } from '../../services/data/persistence.service';
import { ID } from '../../types/id';

import { AgePipe } from './age-pipe/age.pipe';
import { DescriptionListItemComponent } from './description-list/description-list-item.component';
import { DescriptionListComponent } from './description-list/description-list.component';

@Component({
  selector: 'app-view',
  imports: [
    AgePipe,
    DescriptionListComponent,
    DescriptionListItemComponent,
    SkyAlertModule,
    SkyAvatarModule,
    SkyBoxModule,
    SkyDatePipeModule,
    SkyErrorModule,
    SkyFluidGridModule,
    SkyPageHeaderModule,
    SkyPageModule,
  ],
  styleUrl: './view.component.css',
  templateUrl: './view.component.html',
})
export class ViewComponent {
  public readonly id = input<string>(inject(ID, { optional: true }) ?? '');
  public readonly disableMargin = input<boolean, unknown>(false, {
    transform: booleanAttribute,
  });

  readonly #dataService = inject(DataService);
  readonly #persistenceService = inject(PersistenceService);

  protected readonly dataOrUndefined = computed(() => {
    if (this.#persistenceService.loading()) {
      return undefined;
    }
    const id = this.id();
    return id && this.#dataService.get(id)();
  });
}
