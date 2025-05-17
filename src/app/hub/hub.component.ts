import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SkyBoxModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';
import { distinctUntilChanged, map, startWith } from 'rxjs';
import { welcomeToSkyuxLinks } from '../welcome-to-skyux/welcome-to-skyux-links';
import { WelcomeToSkyuxComponent } from '../welcome-to-skyux/welcome-to-skyux.component';
import { DataService } from '../services/data/data.service';
import { PersistenceService } from '../services/data/persistence.service';

@Component({
  selector: 'app-hub',
  standalone: true,
  imports: [
    CommonModule,
    SkyActionHubModule,
    WelcomeToSkyuxComponent,
    SkyBoxModule,
  ],
  templateUrl: './hub.component.html',
  styleUrl: './hub.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubComponent {
  protected readonly needsAttention = computed(() => {
    const needsAttentionCount = this.#needsAttentionCount();
    const singular = needsAttentionCount === 1;
    return [
      {
        title: `${needsAttentionCount} animal${singular ? '' : 's'} need${singular ? 's' : ''} attention`,
        permalink: { route: { commands: ['animal-profiles'] } },
      },
    ];
  });
  protected readonly relatedLinks = welcomeToSkyuxLinks.map((link) => ({
    label: link.label,
    permalink: {
      url: link.url,
    },
  }));
  protected readonly title = 'Animal Profiles';

  readonly #dataService = inject(DataService);
  readonly #needsAttentionCount = toSignal(
    this.#dataService.list.pipe(
      map((profiles) =>
        profiles.reduce(
          (count, profile) => count + (profile.needsAttention ? 1 : 0),
          0,
        ),
      ),
      startWith(0),
      distinctUntilChanged(),
    ),
    { initialValue: 0 },
  );

  constructor() {
    // Make sure the data service is loaded before using it.
    inject(PersistenceService);
  }
}

export default HubComponent;
