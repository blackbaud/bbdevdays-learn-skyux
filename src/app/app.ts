import { Component, inject, InjectionToken, isDevMode, Signal, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

export const showGithubLink = new InjectionToken<Signal<boolean>>('showGithubLink', {
  factory: () => signal(!isDevMode()),
  providedIn: 'root',
});

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly showGithubLink = inject(showGithubLink);
}
