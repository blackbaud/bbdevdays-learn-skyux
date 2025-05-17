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
        useValue: '1398d177-4fbe-4e39-ad68-c49df7d17f0b',
      },
    ],
    component: ViewComponent,
  },
];
