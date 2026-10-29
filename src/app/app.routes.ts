import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/5bd8a84c-b72c-4aaa-a42d-643d6af0fa0a',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
