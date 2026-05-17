import { ChangeDetectionStrategy, Component, contentChildren, input } from '@angular/core';
import { SkyBoxModule, SkyDescriptionListModule } from '@skyux/layout';

import { DescriptionListItem } from './description-list-item';

@Component({
  selector: 'app-description-list',
  imports: [SkyBoxModule, SkyDescriptionListModule],
  templateUrl: './description-list.html',
  styles: `
    :host {
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DescriptionList {
  public readonly mode = input<'horizontal' | 'vertical'>('vertical');
  protected readonly items = contentChildren(DescriptionListItem);
}
