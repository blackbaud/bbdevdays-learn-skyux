import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withHashLocation } from '@angular/router';
import { SkyUIConfigService } from '@skyux/core';
import { provideInitialTheme } from '@skyux/theme';

import { routes } from './app.routes';
import { AppUIConfigService } from './services/app-ui-config/app-ui-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideInitialTheme('modern'),
    provideRouter(routes, withComponentInputBinding(), withHashLocation()),
    {
      provide: SkyUIConfigService,
      useClass: AppUIConfigService,
    },
  ],
};
