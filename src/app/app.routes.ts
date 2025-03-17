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
        useValue: 'e52947a9-58a5-43fa-9a81-5405bb9c3e58',
      },
    ],
    component: ViewComponent,
  },
];
