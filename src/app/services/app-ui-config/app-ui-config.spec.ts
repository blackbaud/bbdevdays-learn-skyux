import { TestBed } from '@angular/core/testing';

import { firstValueFrom } from 'rxjs';

import { SESSION_STORAGE } from '../data/data';
import { AppUIConfigService } from './app-ui-config';

describe('AppUIConfig', () => {
  let mockStore: Record<string, string>;
  let mockStorage: Partial<Storage>;

  beforeEach(() => {
    mockStore = {};
    mockStorage = {
      getItem: vi.fn((key: string) => mockStore[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStore[key] = value;
      }),
    };

    TestBed.configureTestingModule({
      providers: [AppUIConfigService, { provide: SESSION_STORAGE, useValue: mockStorage }],
    });
  });

  it('should be created', async () => {
    const service = TestBed.inject(AppUIConfigService);
    expect(service).toBeTruthy();
    await expect(firstValueFrom(service.getConfig('key', 'DEFAULT'))).resolves.toEqual('DEFAULT');
    await firstValueFrom(service.setConfig('key', 'VALUE'));
    await expect(firstValueFrom(service.getConfig('key', 'DEFAULT'))).resolves.toEqual('VALUE');
  });
});
