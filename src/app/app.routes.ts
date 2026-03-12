import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/675767e5-a093-4f64-971e-06d12ceda60e',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
