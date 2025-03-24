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
        useValue: 'c3d877e2-2d1a-42ed-84b2-4888f012e08f',
      },
    ],
    component: ViewComponent,
  },
];
