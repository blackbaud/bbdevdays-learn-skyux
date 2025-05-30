import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';

import { parentLink } from '../animal-profiles/parent-link';
import { DataService } from '../services/data/data.service';
import { PersistenceService } from '../services/data/persistence.service';
import { welcomeToSkyuxLinks } from '../welcome-to-skyux/welcome-to-skyux-links';
import { WelcomeToSkyuxComponent } from '../welcome-to-skyux/welcome-to-skyux.component';

@Component({
  selector: 'app-hub',
  imports: [SkyActionHubModule, SkyBoxModule, WelcomeToSkyuxComponent],
  templateUrl: './hub.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubComponent {
  protected needsAttention = computed(() => {
    const needsAttentionCount = this.#needsAttentionCount();
    const singular = needsAttentionCount === 1;
    return [
      {
        title: `${needsAttentionCount} animal${singular ? '' : 's'} need${singular ? 's' : ''} attention`,
        permalink: { route: { commands: ['animal-profiles'] } },
      },
    ];
  });
  protected relatedLinks = welcomeToSkyuxLinks.map((link) => ({
    label: link.label,
    permalink: {
      url: link.url,
    },
  }));
  protected title = parentLink.label;

  #dataService = inject(DataService);
  #needsAttentionCount = computed(() =>
    this.#dataService
      .list()
      .reduce((count, profile) => count + (profile.needsAttention ? 1 : 0), 0),
  );

  constructor() {
    // Make sure the data service is loaded before using it.
    inject(PersistenceService);
  }
}

export default HubComponent;
