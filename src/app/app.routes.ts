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
        useValue: '4f24eb2c-deaa-4ee9-bc05-b1d0b614f089',
      },
    ],
    component: ViewComponent,
  },
];
