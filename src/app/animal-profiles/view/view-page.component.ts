import { Component, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { PersistenceService } from '../../services/data/persistence.service';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';

import { ViewComponent } from './view.component';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  imports: [
    RouterLink,
    SkyIconModule,
    SkyPageModule,
    SkyWaitModule,
    ViewComponent,
  ],
})
export class ViewPageComponent {
  public readonly id = input<string>();
  protected readonly editService = inject(EditService);
  protected readonly loading = inject(PersistenceService).loading;
  protected readonly parentLink = parentLink;

  protected edit(): void {
    this.editService.edit(this.id());
  }
}

export default ViewPageComponent;
