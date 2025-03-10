import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

/**
 * Provides a token for browser session storage. This token makes it easier to
 * mock session storage in tests.
 */
export const SESSION_STORAGE = new InjectionToken<Storage | undefined>(
  'Session Storage',
  {
    providedIn: 'root',
    factory: () => inject(DOCUMENT).defaultView?.sessionStorage,
  },
);
