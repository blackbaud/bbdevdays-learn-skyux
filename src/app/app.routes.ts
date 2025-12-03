import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/e69a74e7-36f2-4827-9ea1-f6a3d854462b',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
