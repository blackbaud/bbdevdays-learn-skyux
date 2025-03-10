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
        useValue: 'e252f4ca-5c73-4fa9-8e13-9d2813ebadb9',
      },
    ],
    component: ViewComponent,
  },
];
