import { httpResource } from '@angular/common/http';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

import { AnimalProfile } from '../../types/animal-profile';
import { AnimalProfileSerialized } from '../../types/animal-profile-serialized';
import { SESSION_STORAGE } from '../session-storage/session-storage';

import { DataService } from './data.service';
import { PersistenceServiceInterface } from './persistence-service-interface';

/**
 * This service interacts with a backend HTTP service to load and save data.
 *
 * For demo purposes, the initial data is read from a static JSON file, and
 * changes are written to the browser's session storage.
 */
@Injectable({
  providedIn: 'root',
})
export class PersistenceService implements PersistenceServiceInterface {
  #dataService = inject(DataService);
  #loading = signal(false);
  #resource = httpResource<AnimalProfile[]>('records.json', {
    parse: (data) => this.#fromSerialized(data as AnimalProfileSerialized[]),
  });
  #storage = inject(SESSION_STORAGE);

  public loading = computed(
    () => this.#loading() && this.#resource.isLoading(),
  );

  constructor() {
    /**
     * Load the initial data from session storage, if available, or from the
     * static JSON file.
     */
    const storageValue = this.#storage?.getItem('animal-profiles');
    if (storageValue) {
      const data = JSON.parse(storageValue) as AnimalProfileSerialized[];
      this.#resource.set(this.#fromSerialized(data));
    } else {
      this.resetData();
    }

    effect(() => {
      if (this.#resource.hasValue()) {
        const data = this.#resource.value();
        this.#dataService.load(data);
        this.#loading.set(false);
      }
    });

    /**
     * After the initial data is loaded, subscribe to changes and write them to
     * session storage.
     */
    effect(() => {
      const data = this.#dataService.list();
      this.#storage?.setItem(
        'animal-profiles',
        JSON.stringify(this.#toSerialized(data)),
      );
    });
  }

  /**
   * Reset the data to the initial state by loading it from the static JSON
   * file.
   */
  public resetData(): void {
    this.#loading.set(true);
    this.#resource.reload();
  }

  /**
   * Map serialized data to the application's data model.
   * We want the Date objects to be stored in the database as ISO strings and
   * to be deserialized as Date objects, not strings.
   */
  #fromSerialized(data: AnimalProfileSerialized[]): AnimalProfile[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate ? new Date(item.birthdate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }

  /**
   * Map the application's data model to a serialized format.
   * We want the Date objects to be stored in the database as ISO strings.
   */
  #toSerialized(data: AnimalProfile[]): AnimalProfileSerialized[] {
    return data.map((item) => {
      const birthdate = item.birthdate;
      if (birthdate) {
        birthdate.setHours(0, 0, 0, 0);
      }
      return {
        ...item,
        birthdate: birthdate?.toISOString(),
        createdAt: item.createdAt.toISOString(),
        updatedAt: item.updatedAt.toISOString(),
      };
    });
  }
}
