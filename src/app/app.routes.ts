import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/98b67d9f-0a6f-4fda-bc9f-918847dfd9ed',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
