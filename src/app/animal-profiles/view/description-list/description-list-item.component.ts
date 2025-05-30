import { Component, input } from '@angular/core';
import { SkyDescriptionListModule } from '@skyux/layout';

@Component({
  selector: 'app-description-list-item',
  imports: [SkyDescriptionListModule],
  template: ``,
})
export class DescriptionListItemComponent {
  public term = input.required<string>();
  public description = input.required<string>();
}
