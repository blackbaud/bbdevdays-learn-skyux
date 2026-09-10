import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { AppUIConfigService } from './app-ui-config';

describe('AppUIConfig', () => {
  let mockStorage: Record<string, string>;

  beforeEach(() => {
    mockStorage = {};

    spyOn(Storage.prototype, 'getItem').and.callFake((key: string) => mockStorage[key] || null);
    spyOn(Storage.prototype, 'setItem').and.callFake((key: string, value: string) => {
      mockStorage[key] = value;
    });

    TestBed.configureTestingModule({
      providers: [AppUIConfigService],
    });
  });

  it('should be created', async () => {
    const service = TestBed.inject(AppUIConfigService);
    expect(service).toBeTruthy();
    expect(await firstValueFrom(service.getConfig('key', 'DEFAULT'))).toEqual('DEFAULT');
    await firstValueFrom(service.setConfig('key', 'VALUE'));
    expect(await firstValueFrom(service.getConfig('key', 'DEFAULT'))).toEqual('VALUE');
  });
});
