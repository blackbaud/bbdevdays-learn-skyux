import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/b078cd4f-3396-4d7d-bc2c-69a64e564081',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
