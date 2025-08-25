import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/1c99cfda-5a69-4a55-b880-21f8791f106c',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
