import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { SETTINGS } from '../../settings';
import { SESSION_STORAGE } from '../session-storage/session-storage.service';

@Injectable()
export class AppUIConfigService {
  readonly #appID = SETTINGS.appID;
  readonly #storage = inject(SESSION_STORAGE);

  public getConfig(key: string, defaultConfig: unknown): Observable<unknown> {
    const config = this.#storage?.getItem(`${this.#appID}-${key}`);
    if (config) {
      return of(JSON.parse(config));
    } else {
      return of(defaultConfig);
    }
  }

  public setConfig(key: string, value: unknown): Observable<unknown> {
    this.#storage?.setItem(`${this.#appID}-${key}`, JSON.stringify(value));
    return of(value);
  }
}
