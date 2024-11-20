import { DOCUMENT } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

export const CRYPTO = new InjectionToken<Crypto | undefined>('Crypto', {
  providedIn: 'root',
  factory: () => inject(DOCUMENT).defaultView?.crypto,
});
