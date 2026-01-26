import { Component, inject, input } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyPageModule } from '@skyux/pages';

import { Data } from '../../services/data/data';
import { EditService } from '../edit/edit.service';
import { parentLink } from '../parent-link';

import { EDIT_ACTION, View } from './view';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.html',
  imports: [SkyIconModule, SkyPageModule, SkyWaitModule, View],
  providers: [
    {
      provide: EDIT_ACTION,
      useFactory: (editService: EditService) => (id: string) => editService.edit(id),
      deps: [EditService],
    },
  ],
})
export class ViewPage {
  public readonly id = input<string>();
  protected readonly loading = inject(Data).loading;
  protected readonly parentLink = parentLink;
}

export default ViewPage;
