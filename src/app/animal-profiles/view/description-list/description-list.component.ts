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
  public readonly mode = input<'horizontal' | 'vertical'>('vertical');
  protected readonly items = contentChildren(DescriptionListItemComponent);
}
