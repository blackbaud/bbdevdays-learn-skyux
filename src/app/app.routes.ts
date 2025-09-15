import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/4c26a2f1-277d-4143-9707-62b438ffee30',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
