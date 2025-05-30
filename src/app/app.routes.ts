import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./hub/hub.component'),
  },
  {
    path: 'animal-profiles',
    loadComponent: () => import('./animal-profiles/list/list.component'),
  },
  {
    path: 'animal-profiles/view/:id',
    loadComponent: () => import('./animal-profiles/view/view-page.component'),
  },
];
