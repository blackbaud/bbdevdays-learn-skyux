import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { SESSION_STORAGE } from '@ng-web-apis/common';
import { AnimalProfile } from '../../types/animal-profile';
import { DataService } from './data.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class PersistenceService {
  public readonly loading: Observable<boolean>;

  readonly #client = inject(HttpClient);
  readonly #dataService = inject(DataService);
  readonly #loading = new BehaviorSubject(true);
  readonly #storage = inject(SESSION_STORAGE);

  constructor() {
    this.loading = this.#loading.asObservable();
    const storageValue = this.#storage.getItem('animal-profiles');
    if (storageValue) {
      const data = JSON.parse(storageValue);
      this.#dataService.load(this.#mapData(data));
      this.#loading.next(false);
    } else {
      this.resetData();
    }

    this.#dataService.list.pipe(takeUntilDestroyed()).subscribe((data) => {
      this.#storage.setItem(
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
      .get<AnimalProfile[]>('assets/records.json')
      .subscribe((data) => {
        this.#dataService.load(this.#mapData(data));
        this.#loading.next(false);
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #mapData(data: any[]): AnimalProfile[] {
    return data.map(
      (item) =>
        ({
          ...item,
          birthdate: item.birthdate ? new Date(item.birthdate) : undefined,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }) as AnimalProfile,
    );
  }
}
