import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/ffae4f9d-f1d4-4f72-862d-3b017a285aa6',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
