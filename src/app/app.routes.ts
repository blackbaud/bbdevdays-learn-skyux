import { Routes } from '@angular/router';

import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/1bc5cad4-f3c1-445b-a39a-f52dd6671b17',
  },
  {
    path: 'animal-profiles/view/:id',
    component: ViewComponent,
  },
];
