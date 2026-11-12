import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import {
  PreloadAllModules,
  provideRouter,
  withComponentInputBinding,
  withHashLocation,
  withPreloading,
} from '@angular/router';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideInitialTheme('modern'),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withHashLocation(),
      withPreloading(PreloadAllModules),
    ),
  ],
};
