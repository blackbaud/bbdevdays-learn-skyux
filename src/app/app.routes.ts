import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/685d089a-5faa-418f-b1bc-fd9abb27a66d',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
