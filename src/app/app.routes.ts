import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'animal-profiles/view/1083ae12-e502-4ceb-a437-5b0627f0bf20',
  },
  {
    path: 'animal-profiles/view/:id',
    loadComponent: () => import('./animal-profiles/view/view-page'),
  },
];
