import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/1a3e394b-2565-4a58-a9bb-7945c3951128',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
