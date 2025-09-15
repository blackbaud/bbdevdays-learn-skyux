import { TestBed } from '@angular/core/testing';

import { DataService } from './data.service';

describe('DataService', () => {
  it('should be created', async () => {
    const dataService = TestBed.inject(DataService);
    expect(dataService).toBeTruthy();
    const createdAt = new Date();
    const updatedAt = new Date();
    const birthdate = new Date();
    dataService.load([
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
    expect(dataService.list()).toEqual([
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
    dataService.set({
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
    expect(dataService.list()[0].name).toEqual('new name');
    dataService.toggleNeedsAttention('id');
    dataService.toggleNeedsAttention('unknown');
    expect(dataService.get('id')()?.name).toEqual('new name');
    expect(dataService.get('id')()?.needsAttention).toBeTrue();
    dataService.delete('id');
    expect(dataService.list()).toEqual([]);
  });
});
