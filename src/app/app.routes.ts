import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/a287983e-59ed-46a2-8b38-4c24d0f89143',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
