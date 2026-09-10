import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/6ada15cd-cf4f-4c55-ac31-55f205e78c36',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
