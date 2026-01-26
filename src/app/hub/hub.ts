import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';

import { parentLink } from '../animal-profiles/parent-link';
import { Data } from '../services/data/data';
import { welcomeToSkyuxLinks } from '../welcome-to-skyux/welcome-to-skyux-links';
import { WelcomeToSkyux } from '../welcome-to-skyux/welcome-to-skyux';

@Component({
  selector: 'app-hub',
  imports: [SkyActionHubModule, SkyBoxModule, WelcomeToSkyux],
  templateUrl: './hub.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hub {
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
  protected readonly title = parentLink.label;

  readonly #dataService = inject(Data);
  readonly #needsAttentionCount = computed(() =>
    this.#dataService
      .list()
      .reduce((count, profile) => count + (profile.needsAttention ? 1 : 0), 0),
  );
}

export default Hub;
