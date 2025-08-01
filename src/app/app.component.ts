import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { environment } from '../environments/environment';

import { WelcomeToSkyuxComponent } from './welcome-to-skyux/welcome-to-skyux.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WelcomeToSkyuxComponent],
  styleUrl: './app.component.css',
  templateUrl: './app.component.html',
})
export class AppComponent {
  protected readonly environment = environment;
}
