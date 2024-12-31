import {
  Component,
  createEnvironmentInjector,
  EnvironmentInjector,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { SkyPageModule } from '@skyux/pages';
import { ViewComponent } from './view.component';
import { EditService } from '../edit/edit.service';
import { SkyIconModule } from '@skyux/indicators';
import { RouterLink } from '@angular/router';
import { parentLink } from '../parent-link';
import { SETTINGS } from '../../settings';
import { CdkPortalOutlet, ComponentPortal } from '@angular/cdk/portal';
import { ID } from '../../types/id';

@Component({
  standalone: true,
  selector: 'app-view-page',
  templateUrl: './view-page.component.html',
  imports: [
    CdkPortalOutlet,
    RouterLink,
    SkyIconModule,
    SkyPageModule,
    ViewComponent,
  ],
})
export class ViewPageComponent implements OnInit {
  public readonly id = input<string>();

  protected readonly editService = inject(EditService);
  protected readonly parentLink = parentLink;
  protected readonly settings = SETTINGS.animalProfiles;
  protected viewPortal: ComponentPortal<ViewComponent> | undefined = undefined;

  readonly #environmentInjector = inject(EnvironmentInjector);

  public ngOnInit(): void {
    const injector = createEnvironmentInjector(
      [
        {
          provide: ID,
          useFactory: this.id,
        },
      ],
      this.#environmentInjector,
    );
    this.viewPortal = new ComponentPortal(ViewComponent, null, injector);
  }

  protected edit(): void {
    this.editService.edit(this.id());
  }
}
