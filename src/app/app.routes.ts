import { Routes } from '@angular/router';

import { View } from './animal-profiles/view/view';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/6f6db0f8-abe7-449d-96bf-0028ca20109f',
  },
  {
    path: 'animal-profiles/view/:id',
    component: View,
  },
];
