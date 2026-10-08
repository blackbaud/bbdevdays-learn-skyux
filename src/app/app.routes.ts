import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/7ae77212-c9e5-417b-b418-c874c4a6e8ad',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
