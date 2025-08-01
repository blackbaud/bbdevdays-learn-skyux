import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/3f90ee34-77fc-41a1-a336-bcf1cf34122d',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
