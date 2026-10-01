import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/a29a94a0-0f4d-4470-ab1b-47d8a3571758',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
