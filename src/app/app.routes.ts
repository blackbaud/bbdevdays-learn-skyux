import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/725e4bf5-5afa-45ec-9811-72f0f5655198',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
