import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { SkyBoxModule } from '@skyux/layout';
import { SkyActionHubModule } from '@skyux/pages';
import { SETTINGS } from '../settings';
import { welcomeToSkyuxLinks } from '../welcome-to-skyux/welcome-to-skyux-links';
import { WelcomeToSkyuxComponent } from '../welcome-to-skyux/welcome-to-skyux.component';
import { DataService } from '../services/data/data.service';
import { PersistenceService } from '../services/data/persistence.service';
import { map, Observable } from 'rxjs';

interface NeedsAttentionItem {
  title: string;
  permalink: {
    route?: {
      commands: string[];
    };
    url?: string;
  };
}

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
  styleUrls: ['./hub.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HubComponent {
  protected readonly loading: Observable<boolean>;
  protected needsAttention: Observable<NeedsAttentionItem[]>;
  protected readonly relatedLinks = welcomeToSkyuxLinks.map((link) => ({
    label: link.label,
    permalink: {
      url: link.url,
    },
  }));
  protected readonly title = SETTINGS.title;

  readonly #dataService = inject(DataService);
  readonly #persistenceService = inject(PersistenceService);

  constructor() {
    this.loading = this.#persistenceService.loading;
    this.needsAttention = this.#dataService.list.pipe(
      map((profiles) => {
        const needsAttentionCount = profiles.reduce(
          (count, profile) => count + (profile.needsAttention ? 1 : 0),
          0,
        );
        const singular = needsAttentionCount === 1;
        return [
          {
            title: `${needsAttentionCount} animal${singular ? '' : 's'} need${singular ? 's' : ''} attention`,
            permalink: {
              route: {
                commands: ['animal-profiles'],
              },
            },
          },
        ];
      }),
    );
  }
}
