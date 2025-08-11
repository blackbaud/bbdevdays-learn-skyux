import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/018f11ee-ceea-452d-98bc-69b2fc21f2c7',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
