import { Component, computed, inject, input } from '@angular/core';
import { SkyAvatarModule } from '@skyux/avatar';
import { SkyDatePipeModule } from '@skyux/datetime';
import { SkyErrorModule } from '@skyux/errors';
import {
  SkyBoxModule,
  SkyDescriptionListModule,
  SkyFluidGridModule,
} from '@skyux/layout';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyPageHeaderModule, SkyPageModule } from '@skyux/pages';
import { DataService } from '../../services/data/data.service';
import { ID } from '../../types/id';
import { AgePipe } from './age-pipe/age.pipe';
import { DescriptionListComponent } from './description-list/description-list.component';
import { DescriptionListItemComponent } from './description-list/description-list-item.component';

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
    SkyDescriptionListModule,
    SkyErrorModule,
    SkyFluidGridModule,
    SkyPageHeaderModule,
    SkyPageModule,
  ],
  styleUrl: './view.component.scss',
  templateUrl: './view.component.html',
})
export class ViewComponent {
  public readonly id = input<string>(inject(ID, { optional: true }) ?? '');
  readonly #dataService = inject(DataService);
  protected readonly dataOrUndefined = computed(() =>
    this.#dataService.get(this.id())(),
  );
}
