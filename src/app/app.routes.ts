import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/f6dca9e5-f507-4dbc-8520-b36d403dd6c2',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
