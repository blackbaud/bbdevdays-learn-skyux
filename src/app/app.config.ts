import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideInitialTheme('modern'),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
  ],
};
