import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { PersistenceService } from './persistence.service';
import { DataService } from './data.service';
import { Component, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { SESSION_STORAGE } from '../session-storage/session-storage.service';
import { MockStorageService } from '../session-storage/mock-storage.service';

@Component({
  providers: [PersistenceService],
  standalone: true,
  template: '',
})
class TestComponent {
  public readonly persistenceService = inject(PersistenceService);
}

describe('PersistenceService', () => {
  let fixture: ComponentFixture<TestComponent>;
  let persistenceService: PersistenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        MockStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockStorageService,
        },
      ],
    });
  });

  it('should initialize with data from storage', async () => {
    const sessionStorage = TestBed.inject(MockStorageService);
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
    const httpClient = TestBed.inject(HttpClient);
    const get = spyOn(httpClient, 'get');
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(get).not.toHaveBeenCalled();
    TestBed.inject(DataService).set({
      id: 'new id',
      name: 'new name',
      bio: 'new bio',
      gender: 'new gender',
      breed: 'new breed',
      birthdate,
      createdAt: isoDate,
      updatedAt: isoDate,
      images: [],
    });
    fixture.detectChanges();
    await fixture.whenStable();
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
        {
          id: 'new id',
          name: 'new name',
          bio: 'new bio',
          gender: 'new gender',
          breed: 'new breed',
          birthdate: birthdate.toISOString(),
          createdAt: isoDate.toISOString(),
          updatedAt: isoDate.toISOString(),
          images: [],
        },
      ]),
    );
  });

  it('should initialize data via http', async () => {
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    persistenceService = fixture.componentInstance.persistenceService;
    expect(persistenceService).toBeTruthy();
    const httpTesting = TestBed.inject(HttpTestingController);
    const req = httpTesting.expectOne(
      'records.json',
      'Request to records.json',
    );
    const isoDate = new Date();
    const birthdate = new Date();
    birthdate.setHours(0, 0, 0, 0);
    req.flush([
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
    ]);
    const dataService = TestBed.inject(DataService);
    expect(await firstValueFrom(dataService.list)).toEqual([
      {
        id: 'id',
        name: 'name',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        birthdate,
        createdAt: isoDate,
        updatedAt: isoDate,
        images: [],
      },
    ]);
  });
});
