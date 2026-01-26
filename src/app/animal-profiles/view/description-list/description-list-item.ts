import { Component, input } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  selector: 'app-description-list-item',
  imports: [SkyDescriptionListModule],
  template: ``,
})
export class DescriptionListItem {
  public readonly term = input.required<string>();
  public readonly description = input.required<string>();
}
