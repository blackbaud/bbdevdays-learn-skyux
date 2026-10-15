import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/526ae33c-94d0-4d3e-bd51-172e35a800ec',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
