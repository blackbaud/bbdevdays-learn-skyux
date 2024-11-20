import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { map, Observable } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';
import { DescriptionListComponent } from './description-list/description-list.component';
import { DescriptionListItemComponent } from './description-list/description-list-item.component';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    AsyncPipe,
    DescriptionListComponent,
    DescriptionListItemComponent,
    NgTemplateOutlet,
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
  templateUrl: './view.component.html',
  styleUrl: './view.component.scss',
})
export class ViewComponent {
  public readonly dataOrUndefined: Observable<AnimalProfile | undefined>;

  readonly #dataService = inject(DataService);

  constructor() {
    const id = inject(ID, { optional: true });
    this.dataOrUndefined = this.#dataService.list.pipe(
      map((data) => {
        return data.find((d) => d.id === id);
      }),
    );
  }

  protected age(birthdate?: Date): string {
    if (!birthdate) {
      return 'N/A';
    }
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    const oneYear = 1000 * 60 * 60 * 24 * 365;

    const diff = Date.now() - birthdate.getTime();

    // If less than a year old, show months
    if (diff < oneYear) {
      return Math.floor(diff / oneMonth) + ' months';
    }

    // If less than 2 years old, show years and months
    if (diff < oneYear * 2) {
      return (
        Math.floor(diff / oneYear) +
        ' years, ' +
        Math.floor((diff % oneYear) / oneMonth) +
        ' months'
      );
    }

    // If older than 2 years, show years
    return Math.floor(diff / oneYear) + ' years';
  }
}
