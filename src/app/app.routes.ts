import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/a28b0c88-e7d0-46b2-9ef4-6f9c7fb3b356',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
