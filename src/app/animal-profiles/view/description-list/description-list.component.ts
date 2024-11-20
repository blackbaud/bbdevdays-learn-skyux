import { Component, contentChildren } from '@angular/core';
import { SkyBoxModule, SkyDescriptionListModule } from '@skyux/layout';
import { DescriptionListItemComponent } from './description-list-item.component';

@Component({
  selector: 'app-description-list',
  standalone: true,
  imports: [
    SkyBoxModule,
    SkyDescriptionListModule,
    DescriptionListItemComponent,
  ],
  templateUrl: './description-list.component.html',
  styles: `
    :host {
      display: block;
    }
  `,
})
export class DescriptionListComponent {
  protected readonly items = contentChildren(DescriptionListItemComponent);
}
