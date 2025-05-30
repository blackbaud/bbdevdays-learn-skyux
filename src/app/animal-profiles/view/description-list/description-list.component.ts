import { Component, contentChildren, input } from '@angular/core';
import { SkyBoxModule, SkyDescriptionListModule } from '@skyux/layout';

import { DescriptionListItemComponent } from './description-list-item.component';

@Component({
  selector: 'app-description-list',
  imports: [SkyBoxModule, SkyDescriptionListModule],
  templateUrl: './description-list.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class DescriptionListComponent {
  public mode = input<'horizontal' | 'vertical'>('vertical');
  protected items = contentChildren(DescriptionListItemComponent);
}
