import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/e9c3d494-bd49-4b76-baa8-bf91384548cc',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
