import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';

import { MockSessionStorageService } from '../session-storage/mock-session-storage.service';
import { SESSION_STORAGE } from '../session-storage/session-storage';

import { DataService } from './data.service';
import { PersistenceService } from './persistence.service';

describe('PersistenceService', () => {
  let httpTesting: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockSessionStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockSessionStorageService,
        },
      ],
    });
    httpTesting = TestBed.inject(HttpTestingController);
  });

  it('should initialize with data from storage', fakeAsync(() => {
    const sessionStorage = TestBed.inject(MockSessionStorageService);
    const isoDate = new Date();
    const birthdate = new Date();
    birthdate.setHours(0, 0, 0, 0);
    sessionStorage.removeItem('animal-profiles');
    sessionStorage.clear();
    expect(sessionStorage.key(0)).toBeFalsy();
    expect(sessionStorage.getItem('animal-profiles')).toBeFalsy();
    sessionStorage.setItem(
      'animal-profiles',
      JSON.stringify([
        {
          id: 'id',
          name: 'name',
          bio: 'bio',
          gender: 'gender',
          breed: 'breed',
          birthdate: birthdate.toISOString(),
          createdAt: isoDate.toISOString(),
          updatedAt: isoDate.toISOString(),
          images: [],
        },
      ]),
    );
    expect(sessionStorage.length).toEqual(1);
    expect(sessionStorage.key(0)).toEqual('animal-profiles');
    expect(sessionStorage.getItem('animal-profiles')).toBeTruthy();
    const persistenceService = TestBed.inject(PersistenceService);
    expect(persistenceService).toBeTruthy();
    expect(persistenceService.loading()).toBeFalse();
    expect(sessionStorage.getItem('animal-profiles')).toEqual(
      JSON.stringify([
        {
          id: 'id',
          name: 'name',
          bio: 'bio',
          gender: 'gender',
          breed: 'breed',
          birthdate: birthdate.toISOString(),
          createdAt: isoDate.toISOString(),
          updatedAt: isoDate.toISOString(),
          images: [],
        },
      ]),
    );
    httpTesting.expectNone('records.json', 'Request to records.json');
    persistenceService.resetData();
    expect(persistenceService.loading()).toBeTrue();
    tick();
    const req = httpTesting.expectOne(
      'records.json',
      'Request to records.json',
    );
    req.flush([]);
    tick();
    expect(sessionStorage.getItem('animal-profiles')).toEqual('[]');
  }));

  it('should initialize data via http', fakeAsync(() => {
    const persistenceService = TestBed.inject(PersistenceService);
    expect(persistenceService).toBeTruthy();
    tick();
    const req = httpTesting.expectOne(
      'records.json',
      'Request to records.json',
    );
    const isoDate = new Date();
    req.flush([
      {
        id: 'id',
        name: 'name',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        birthdate: undefined,
        createdAt: isoDate.toISOString(),
        updatedAt: isoDate.toISOString(),
        images: [],
      },
    ]);
    tick();
    const dataService = TestBed.inject(DataService);
    expect(dataService.list()).toEqual([
      {
        id: 'id',
        name: 'name',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        birthdate: undefined,
        createdAt: isoDate,
        updatedAt: isoDate,
        images: [],
      },
    ]);
  }));
});
