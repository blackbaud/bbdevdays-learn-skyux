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
        useValue: '5c2d1d7b-f18c-4ed9-9c23-70423a0a26ad',
      },
    ],
    component: ViewComponent,
  },
];
