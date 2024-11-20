import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject } from 'rxjs';
import {
  AnimalProfile,
  AnimalProfileSerialized,
} from '../../types/animal-profile';
import { SESSION_STORAGE } from '../session-storage/session-storage.service';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  readonly #client = inject(HttpClient);
  readonly #dataService = inject(DataService);
  readonly #loading = new BehaviorSubject(true);
  readonly #storage = inject(SESSION_STORAGE);

  public readonly loading = this.#loading.asObservable();

  constructor() {
    const storageValue = this.#storage?.getItem('animal-profiles');
    if (storageValue) {
      const data = JSON.parse(storageValue) as AnimalProfileSerialized[];
      this.#dataService.load(this.#mapData(data));
      this.#loading.next(false);
    } else {
      this.resetData();
    }

    this.#dataService.list.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.#storage?.setItem(
        'animal-profiles',
        JSON.stringify(
          data.map((item) => {
            const birthdate = item.birthdate;
            if (birthdate) {
              birthdate.setHours(0, 0, 0, 0);
            }
            return {
              ...item,
              birthdate: birthdate ? birthdate.toISOString() : undefined,
              createdAt: item.createdAt.toISOString(),
              updatedAt: item.updatedAt.toISOString(),
            };
          }),
        ),
      );
    });
  }

  public resetData(): void {
    this.#loading.next(true);
    this.#client
      .get<AnimalProfileSerialized[]>('records.json')
      .subscribe((data) => {
        this.#dataService.load(this.#mapData(data));
        this.#loading.next(false);
      });
  }

  #mapData(data: AnimalProfileSerialized[]): AnimalProfile[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate ? new Date(item.birthdate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }
}
