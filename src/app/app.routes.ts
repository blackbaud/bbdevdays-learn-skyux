import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/75bdc347-7503-414c-a0e7-9ae96065270b',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
