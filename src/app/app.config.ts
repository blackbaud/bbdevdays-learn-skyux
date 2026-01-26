import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { SkyUIConfigService } from '@skyux/core';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app.routes';
import { AppUIConfigService } from './services/app-ui-config/app-ui-config';
import { Data } from './services/data/data';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withFetch()),
    provideInitialTheme('modern'),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    Data,
    {
      provide: SkyUIConfigService,
      useClass: AppUIConfigService,
    },
  ],
};
