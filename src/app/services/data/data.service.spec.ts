import { TestBed } from '@angular/core/testing';
import { DataService } from './data.service';
import { firstValueFrom } from 'rxjs';

describe('DataService', () => {
  it('should be created', async () => {
    const service = TestBed.inject(DataService);
    expect(service).toBeTruthy();
    const createdAt = new Date();
    const updatedAt = new Date();
    const birthdate = new Date();
    service.load([
      {
        id: 'id',
        name: 'name',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        birthdate,
        createdAt,
        updatedAt,
        images: [],
      },
    ]);
    expect(await firstValueFrom(service.list)).toEqual([
      {
        id: 'id',
        name: 'name',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        birthdate,
        createdAt,
        updatedAt,
        images: [],
      },
    ]);
    service.set({
      id: 'id',
      name: 'new name',
      bio: 'bio',
      gender: 'gender',
      breed: 'breed',
      birthdate,
      createdAt,
      updatedAt,
      images: [],
    });
    expect((await firstValueFrom(service.list))?.[0].name).toEqual('new name');
    expect((await firstValueFrom(service.get('id')))?.name).toEqual('new name');
    service.delete('id');
    expect(await firstValueFrom(service.list)).toEqual([]);
  });
});
