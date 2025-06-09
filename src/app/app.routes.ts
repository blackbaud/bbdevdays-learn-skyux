import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/739cba04-295a-45db-a4f5-ae2be4e04e6a',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
