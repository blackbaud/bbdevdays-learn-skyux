import { InjectionToken } from '@angular/core';

/* istanbul ignore file */
export const PersistenceClient = new InjectionToken<
  (url: string) => Promise<unknown>
>('PersistenceClient', {
  providedIn: 'root',
  factory: () => {
    return async (url: string): Promise<Response> => {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      return await response.json();
    };
  },
});
