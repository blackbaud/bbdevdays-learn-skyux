import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/902488cf-e308-4572-ab2e-0b4315673064',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
