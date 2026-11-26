import { Component, computed, inject } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';

import { parentLink } from '../animal-profiles/parent-link';
import { Data } from '../services/data/data';
import { welcomeToSkyuxLinks } from '../welcome-to-skyux/welcome-to-skyux-links';
import { WelcomeToSkyux } from '../welcome-to-skyux/welcome-to-skyux';

function getNeedsAttentionTitle(needsAttentionCount: number): string {
  const singular = needsAttentionCount === 1;

  return `${needsAttentionCount} animal${singular ? '' : 's'} need${singular ? 's' : ''} attention`;
}

@Component({
  selector: 'app-hub',
  imports: [SkyActionHubModule, SkyBoxModule, WelcomeToSkyux],
  templateUrl: './hub.html',
})
export class Hub {
  readonly #dataService = inject(Data);

  protected readonly needsAttention = computed(() => {
    const needsAttentionCount = this.#dataService
      .list()
      .filter((profile) => profile.needsAttention).length;

    return [
      {
        title: getNeedsAttentionTitle(needsAttentionCount),
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
}

export default Hub;
