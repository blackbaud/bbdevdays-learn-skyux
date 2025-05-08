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
        useValue: '78beb0ce-c951-4803-b5c7-d95686ef3fa9',
      },
    ],
    component: ViewComponent,
  },
];
