import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideInitialTheme('modern'),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
  ],
};
