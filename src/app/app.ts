import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { WelcomeToSkyux } from './welcome-to-skyux/welcome-to-skyux';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, WelcomeToSkyux],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {}
