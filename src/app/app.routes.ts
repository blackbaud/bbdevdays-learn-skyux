import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/bb963dd5-71ae-4a52-8f55-03817ad18a4c',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
