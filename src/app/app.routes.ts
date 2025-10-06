import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/fdad34d9-64f3-49a9-9aea-ddbb3c06a1db',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
