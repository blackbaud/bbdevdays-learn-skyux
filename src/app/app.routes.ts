import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/455128a2-ccd2-47c8-80f4-b3483dbd669c',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
