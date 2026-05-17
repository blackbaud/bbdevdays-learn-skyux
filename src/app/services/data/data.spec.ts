import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { Data, SESSION_STORAGE, SessionStorageAdapter } from './data';
import { AnimalProfile } from '../../types/animal-profile';

const STORAGE_KEY = 'animal-profiles';

const buildProfile = (overrides: Partial<AnimalProfile> = {}): AnimalProfile => ({
  id: '1',
  name: 'Test Animal',
  bio: 'Test bio',
  gender: 'Male',
  breed: 'Test breed',
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  updatedAt: new Date('2023-01-02T00:00:00.000Z'),
  images: [],
  ...overrides,
});

const buildMockStorage = () => {
  let store: Record<string, string> = {};
  return {
    clear: jasmine.createSpy('clear').and.callFake(() => {
      store = {};
    }),
    getItem: jasmine.createSpy('getItem').and.callFake((key: string) => store[key] ?? null),
    key: jasmine
      .createSpy('key')
      .and.callFake((index: number) => Object.keys(store)[index] ?? null),
    get length() {
      return Object.keys(store).length;
    },
    removeItem: jasmine.createSpy('removeItem').and.callFake((key: string) => {
      delete store[key];
    }),
    setItem: jasmine.createSpy('setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    }),
  };
};

const flushAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('Data', () => {
  let storage: ReturnType<typeof buildMockStorage>;
  let httpMock: HttpTestingController;

  const configure = () => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: SESSION_STORAGE, useValue: storage },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
  };

  beforeEach(() => {
    storage = buildMockStorage();
  });

  afterEach(() => {
    try {
      httpMock?.verify();
    } finally {
      TestBed.resetTestingModule();
    }
  });

  describe('initialization', () => {
    it('loads from storage and deserializes dates when storage is populated', () => {
      storage.setItem(
        STORAGE_KEY,
        JSON.stringify([
          {
            id: '1',
            name: 'Stored Animal',
            bio: 'From storage',
            gender: 'Female',
            breed: 'Storage breed',
            birthdate: '2020-01-01T00:00:00.000Z',
            createdAt: '2023-01-01T00:00:00.000Z',
            updatedAt: '2023-01-02T00:00:00.000Z',
            images: [],
          },
        ]),
      );
      configure();

      const service = TestBed.inject(Data);

      expect(service.list().length).toBe(1);
      expect(service.list()[0].name).toBe('Stored Animal');
      expect(service.list()[0].birthdate).toBeInstanceOf(Date);
      expect(service.list()[0].birthdate?.getUTCFullYear()).toBe(2020);
      expect(service.list()[0].createdAt).toBeInstanceOf(Date);
      expect(service.list()[0].updatedAt).toBeInstanceOf(Date);
    });

    it('falls back to HTTP and deserializes dates when storage is empty', async () => {
      configure();

      const service = TestBed.inject(Data);
      await flushAsync();
      httpMock.expectOne('records.json').flush([
        {
          id: '1',
          name: 'HTTP Animal',
          bio: 'From HTTP',
          gender: 'Female',
          breed: 'HTTP breed',
          createdAt: '2023-01-01T00:00:00.000Z',
          updatedAt: '2023-01-01T00:00:00.000Z',
          images: [],
        },
      ]);
      await flushAsync();
      TestBed.tick();

      expect(service.list().length).toBe(1);
      expect(service.list()[0].name).toBe('HTTP Animal');
      expect(service.list()[0].createdAt).toBeInstanceOf(Date);
    });

    it('warns and starts empty when storage read throws', async () => {
      const warn = spyOn(console, 'warn').and.callFake(() => undefined);
      storage.getItem.and.callFake(() => {
        throw new Error('Storage error');
      });
      configure();

      const service = TestBed.inject(Data);
      await flushAsync();
      httpMock.expectOne('records.json').flush([]);

      expect(warn).toHaveBeenCalledWith('Failed to load from storage:', jasmine.any(Error));
      expect(service.list()).toEqual([]);
    });
  });

  describe('CRUD operations', () => {
    let service: Data;

    beforeEach(async () => {
      configure();
      service = TestBed.inject(Data);
      await flushAsync();
      httpMock.expectOne('records.json').flush([]);
      await flushAsync();
      TestBed.tick();
    });

    it('load replaces the entire dataset', () => {
      service.load([buildProfile({ id: '2', name: 'Loaded' })]);
      expect(service.list().length).toBe(1);
      expect(service.list()[0].name).toBe('Loaded');
    });

    it('set adds a new profile', () => {
      service.set(buildProfile());
      expect(service.list()).toEqual([buildProfile()]);
    });

    it('set replaces an existing profile with the same id', () => {
      service.set(buildProfile({ name: 'Original' }));
      service.set(buildProfile({ name: 'Updated', gender: 'Female' }));

      expect(service.list().length).toBe(1);
      expect(service.list()[0].name).toBe('Updated');
      expect(service.list()[0].gender).toBe('Female');
    });

    it('get returns a computed signal that tracks updates by id', () => {
      service.set(buildProfile({ name: 'A' }));
      const profile = service.get('1');

      expect(profile()?.name).toBe('A');

      service.set(buildProfile({ name: 'B' }));
      expect(profile()?.name).toBe('B');
    });

    it('delete removes a profile by id', () => {
      service.set(buildProfile());
      service.delete('1');
      expect(service.list()).toEqual([]);
    });

    it('toggleNeedsAttention flips the flag and leaves other records unchanged', () => {
      service.set(buildProfile({ id: '1', needsAttention: false }));
      service.set(buildProfile({ id: '2', needsAttention: false }));

      service.toggleNeedsAttention('1');

      const byId = Object.fromEntries(service.list().map((r) => [r.id, r]));
      expect(byId['1'].needsAttention).toBe(true);
      expect(byId['2'].needsAttention).toBe(false);
    });

    it('toggleNeedsAttention is a no-op for unknown ids', () => {
      service.set(buildProfile({ needsAttention: false }));
      service.toggleNeedsAttention('missing');
      expect(service.list()[0].needsAttention).toBe(false);
    });
  });

  describe('storage persistence', () => {
    let service: Data;

    beforeEach(async () => {
      configure();
      service = TestBed.inject(Data);
      await flushAsync();
      httpMock.expectOne('records.json').flush([]);
      await flushAsync();
      TestBed.tick();
    });

    it('serializes dates to ISO strings when writing to storage', async () => {
      service.set(buildProfile({ birthdate: new Date('2020-01-01T12:30:45.000Z') }));
      await flushAsync();

      const stored = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
      expect(stored.length).toBe(1);
      expect(stored[0].birthdate).toBe('2020-01-01T12:30:45.000Z');
      expect(stored[0].createdAt).toBe('2023-01-01T00:00:00.000Z');
      expect(stored[0].updatedAt).toBe('2023-01-02T00:00:00.000Z');
    });

    it('omits an undefined birthdate when serializing', async () => {
      service.set(buildProfile({ birthdate: undefined }));
      await flushAsync();

      const stored = JSON.parse(storage.getItem(STORAGE_KEY) ?? 'null');
      expect(stored[0].birthdate).toBeUndefined();
    });

    it('warns when storage write throws', async () => {
      const warn = spyOn(console, 'warn').and.callFake(() => undefined);
      storage.setItem.and.callFake(() => {
        throw new Error('Storage error');
      });

      service.set(buildProfile());
      await flushAsync();

      expect(warn).toHaveBeenCalledWith('Failed to save to storage:', jasmine.any(Error));
    });
  });

  describe('resetData', () => {
    it('clears in-memory state, removes from storage, and reloads via HTTP', async () => {
      configure();
      const service = TestBed.inject(Data);
      await flushAsync();
      httpMock.expectOne('records.json').flush([]);
      await flushAsync();
      TestBed.tick();

      service.set(buildProfile());
      await flushAsync();
      expect(service.list().length).toBe(1);
      expect(storage.getItem(STORAGE_KEY)).not.toBeNull();

      service.resetData();

      expect(service.list()).toEqual([]);
      expect(storage.getItem(STORAGE_KEY)).toBeNull();

      await flushAsync();
      httpMock.expectOne('records.json').flush([]);
    });
  });

  describe('loading', () => {
    it('is true while the HTTP request is in flight and false after it resolves', async () => {
      configure();
      const service = TestBed.inject(Data);

      expect(service.loading()).toBe(true);

      await flushAsync();
      httpMock.expectOne('records.json').flush([]);
      await flushAsync();

      expect(service.loading()).toBe(false);
    });
  });
});

describe('SessionStorageAdapter', () => {
  let storage: ReturnType<typeof buildMockStorage>;
  let adapter: SessionStorageAdapter;

  beforeEach(() => {
    storage = buildMockStorage();
    TestBed.configureTestingModule({
      providers: [{ provide: DOCUMENT, useValue: { defaultView: { sessionStorage: storage } } }],
    });
    adapter = TestBed.inject(SessionStorageAdapter);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('getItem proxies to sessionStorage', () => {
    storage.setItem('key', 'value');
    expect(adapter.getItem('key')).toBe('value');
    expect(storage.getItem).toHaveBeenCalledWith('key');
  });

  it('setItem proxies to sessionStorage', () => {
    adapter.setItem('key', 'value');
    expect(storage.setItem).toHaveBeenCalledWith('key', 'value');
  });

  it('removeItem proxies to sessionStorage', () => {
    storage.setItem('key', 'value');
    adapter.removeItem('key');
    expect(adapter.getItem('key')).toBeNull();
  });

  it('returns null for missing keys', () => {
    expect(adapter.getItem('missing')).toBeNull();
  });
});
