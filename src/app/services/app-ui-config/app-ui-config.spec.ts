import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { MockSessionStorageService } from '../session-storage/mock-session-storage.service';
import { SESSION_STORAGE } from '../session-storage/session-storage';

import { AppUIConfigService } from './app-ui-config';

describe('AppUIConfigService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AppUIConfigService,
        {
          provide: SESSION_STORAGE,
          useClass: MockSessionStorageService,
        },
      ],
    });
  });

  it('should be created', async () => {
    const service = TestBed.inject(AppUIConfigService);
    expect(service).toBeTruthy();
    expect(await firstValueFrom(service.getConfig('key', 'DEFAULT'))).toEqual(
      'DEFAULT',
    );
    await firstValueFrom(service.setConfig('key', 'VALUE'));
    expect(await firstValueFrom(service.getConfig('key', 'DEFAULT'))).toEqual(
      'VALUE',
    );
  });
});
