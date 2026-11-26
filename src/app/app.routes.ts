import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/fa73296e-0662-46b0-954a-aa8502887bdc',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
