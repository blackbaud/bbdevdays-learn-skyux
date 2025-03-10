import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, filter, skipUntil } from 'rxjs';
import {
  AnimalProfile,
  AnimalProfileSerialized,
} from '../../types/animal-profile';
import { SESSION_STORAGE } from '../session-storage/session-storage.service';
import { DataService } from './data.service';

/**
 * This service interacts with a backend HTTP service to load and save data.
 *
 * For demo purposes, the initial data is read from a static JSON file, and
 * changes are written to the browser's session storage.
 */
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
    /**
     * Load the initial data from session storage, if available, or from the
     * static JSON file.
     */
    const storageValue = this.#storage?.getItem('animal-profiles');
    if (storageValue) {
      const data = JSON.parse(storageValue) as AnimalProfileSerialized[];
      this.#dataService.load(this.#mapData(data));
      this.#loading.next(false);
    } else {
      this.resetData();
    }

    /**
     * After the initial data is loaded, subscribe to changes and write them to
     * session storage.
     */
    this.#dataService.list
      .pipe(
        takeUntilDestroyed(),
        skipUntil(this.#loading.pipe(filter((loading) => !loading))),
      )
      .subscribe((data) => {
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

  /**
   * Reset the data to the initial state by loading it from the static JSON
   * file.
   */
  public resetData(): void {
    this.#loading.next(true);
    this.#client
      .get<AnimalProfileSerialized[]>('records.json')
      .subscribe((data) => {
        this.#dataService.load(this.#mapData(data));
        this.#loading.next(false);
      });
  }

  /**
   * Map serialized data to the application's data model. JSON does not handle
   * Date objects, so we need to convert the date strings to Date objects.
   */
  #mapData(data: AnimalProfileSerialized[]): AnimalProfile[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate ? new Date(item.birthdate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }
}
