import { Component } from '@angular/core';
import { SkyAlertModule } from '@skyux/indicators';
import { SkyActionButtonModule } from '@skyux/layout';

@Component({
  selector: 'app-welcome-to-skyux',
  imports: [SkyActionButtonModule, SkyAlertModule],
  templateUrl: './welcome-to-skyux.html',
  styleUrl: './welcome-to-skyux.css',
})
export class WelcomeToSkyux {}
