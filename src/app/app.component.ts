import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PersistenceService } from './services/data/persistence.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor() {
    inject(PersistenceService);
  }
}
