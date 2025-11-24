import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/981a511f-231f-4cc5-992d-37926568dbe0',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
