import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/c61eea0f-49a0-4213-8ff8-666a696dd93a',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
