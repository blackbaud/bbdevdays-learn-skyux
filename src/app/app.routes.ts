import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./animal-profiles/list/list.component').then(
        (m) => m.ListComponent,
      ),
  },
  {
    path: 'animal-profiles/view/:id',
    loadComponent: () =>
      import('./animal-profiles/view/view-page.component').then(
        (m) => m.ViewPageComponent,
      ),
  },
];
