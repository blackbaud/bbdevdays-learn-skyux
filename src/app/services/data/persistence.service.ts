import {
  computed,
  effect,
  inject,
  Injectable,
  resource,
  signal,
} from '@angular/core';
import {
  AnimalProfile,
  AnimalProfileSerialized,
} from '../../types/animal-profile';
import { SESSION_STORAGE } from '../session-storage/session-storage';
import { DataService } from './data.service';
import { PersistenceClient } from './persistence-client';
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
  readonly #client =
    inject<(url: string) => Promise<AnimalProfileSerialized[]>>(
      PersistenceClient,
    );
  readonly #dataService = inject(DataService);
  readonly #loading = signal(false);
  readonly #resource = resource<AnimalProfile[], unknown>({
    loader: (): Promise<AnimalProfile[]> =>
      this.#client('records.json').then((data) => this.#mapData(data)),
  });
  readonly #storage = inject(SESSION_STORAGE);

  public readonly loading = computed(
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
      this.#resource.set(this.#mapData(data));
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
        JSON.stringify(
          data.map((item) => {
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
    this.#loading.set(true);
    this.#resource.reload();
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
