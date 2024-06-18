import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WelcomeToSkyuxComponent } from './welcome-to-skyux/welcome-to-skyux.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WelcomeToSkyuxComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {}
