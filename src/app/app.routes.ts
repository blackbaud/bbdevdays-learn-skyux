import { Routes } from '@angular/router';
import { ID } from './types/id';
import { ViewComponent } from './animal-profiles/view/view.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    providers: [
      {
        provide: ID,
        useValue: '822c72f1-a929-4ecd-9a67-ef6408aa5520',
      },
    ],
    component: ViewComponent,
  },
];
