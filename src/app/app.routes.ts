import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/e406a00b-012c-4fea-80e6-fc06b4da301c',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
