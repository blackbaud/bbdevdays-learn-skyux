import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/9f140b5d-b8f6-4ef8-863b-c1a4136dca32',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
