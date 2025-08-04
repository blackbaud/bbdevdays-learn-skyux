import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/ebac9c93-caea-4c11-93e2-c1bb67c4eb25',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
