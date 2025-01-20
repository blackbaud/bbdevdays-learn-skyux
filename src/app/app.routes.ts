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
        useValue: '910b7185-26e0-4a7b-8bc2-d9fad3096ea5',
      },
    ],
    component: ViewComponent,
  },
];
