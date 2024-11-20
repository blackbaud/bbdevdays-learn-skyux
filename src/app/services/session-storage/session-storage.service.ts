import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const SESSION_STORAGE = new InjectionToken<Storage | undefined>(
  'Session Storage',
  {
    providedIn: 'root',
    factory: () => inject(DOCUMENT).defaultView?.sessionStorage,
  },
);
