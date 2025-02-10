import { Routes } from '@angular/router';
import { ID } from './types/id';
import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    providers: [
      {
        provide: ID,
        useValue: 'bb5091d4-edc2-4691-8fcc-1292d015e990',
      },
    ],
    component: ViewComponent,
  },
];
