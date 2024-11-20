import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./hub/hub.component').then((m) => m.HubComponent),
  },
  {
    path: 'animal-profiles',
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
