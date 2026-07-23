import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/3e620831-19b8-4923-bc82-80da0a814e59',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
