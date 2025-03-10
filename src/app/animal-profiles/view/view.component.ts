import { AsyncPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
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
import { Observable, switchMap } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';
import { AgePipe } from './age-pipe/age.pipe';
import { DescriptionListComponent } from './description-list/description-list.component';
import { DescriptionListItemComponent } from './description-list/description-list-item.component';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [
    AgePipe,
    AsyncPipe,
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
  protected readonly dataOrUndefined: Observable<AnimalProfile | undefined>;
  readonly #dataService = inject(DataService);

  constructor() {
    this.dataOrUndefined = toObservable(this.id).pipe(
      switchMap((id) => this.#dataService.get(id)),
    );
  }
}
