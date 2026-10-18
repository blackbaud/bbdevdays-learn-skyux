import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/95cc8666-bec1-43c0-b15a-230927eaeaac',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
