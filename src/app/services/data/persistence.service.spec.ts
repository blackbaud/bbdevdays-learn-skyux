import { TestBed } from '@angular/core/testing';
import { PersistenceService } from './persistence.service';
import { DataService } from './data.service';
import { SESSION_STORAGE } from '../session-storage/session-storage';
import { MockSessionStorageService } from '../session-storage/mock-session-storage.service';
import { PersistenceClient } from './persistence-client';
import { AnimalProfileSerialized } from '../../types/animal-profile';
import { ApplicationRef } from '@angular/core';

describe('PersistenceService', () => {
  let persistenceService: PersistenceService;
  let client: jasmine.Spy;
  let resolve: (data: AnimalProfileSerialized[]) => void = () => undefined;

  beforeEach(() => {
    const dataPromise = new Promise<AnimalProfileSerialized[]>((resolveFn) => {
      resolve = resolveFn;
    });
    client = jasmine
      .createSpy('PersistenceClient')
      .and.returnValue(dataPromise);
    TestBed.configureTestingModule({
      providers: [
        MockSessionStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockSessionStorageService,
        },
        {
          provide: PersistenceClient,
          useValue: client,
        },
      ],
    });
  });

  it('should initialize with data from storage', async () => {
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
    persistenceService = TestBed.inject(PersistenceService);
    expect(client).not.toHaveBeenCalled();
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
    persistenceService.resetData();
    expect(persistenceService.loading()).toBeTrue();
    resolve([]);
    await TestBed.inject(ApplicationRef).whenStable();
    expect(client).toHaveBeenCalledWith('records.json');
    expect(sessionStorage.getItem('animal-profiles')).toEqual('[]');
  });

  it('should initialize data via http', async () => {
    persistenceService = TestBed.inject(PersistenceService);
    expect(persistenceService).toBeTruthy();
    const isoDate = new Date();
    resolve([
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
    const dataService = TestBed.inject(DataService);
    await TestBed.inject(ApplicationRef).whenStable();
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
  });
});
