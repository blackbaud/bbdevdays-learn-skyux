import { Component, inject, input } from '@angular/core';
import { SkyWaitModule } from '@skyux/indicators';

import { Data } from '../../services/data/data';

import { View } from './view';

@Component({
  selector: 'app-view-page',
  templateUrl: './view-page.html',
  imports: [SkyWaitModule, View],
})
export class ViewPage {
  public readonly id = input<string>();
  protected readonly loading = inject(Data).loading;
}

export default ViewPage;
