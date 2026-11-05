import {
  DOCUMENT,
  inject,
  Service,
  InjectionToken,
  Signal,
  computed,
  effect,
  signal,
} from '@angular/core';
import { httpResource } from '@angular/common/http';

import { AnimalProfile } from '../../types/animal-profile';
import { AnimalProfileSerialized } from '../../types/animal-profile-serialized';

export const SESSION_STORAGE = new InjectionToken<Storage | undefined>('sessionStorage', {
  providedIn: 'root',
  /* istanbul ignore start -- @preserve */
  factory: () => inject(DOCUMENT).defaultView?.sessionStorage,
  /* istanbul ignore stop -- @preserve */
});

@Service()
export class Data {
  readonly #storageKey = 'animal-profiles';
  readonly #storage = inject(SESSION_STORAGE);

  readonly #initialData = this.#loadFromStorage();
  readonly #shouldFetchFromHttp = signal(this.#initialData === undefined);

  readonly #resource = httpResource<AnimalProfile[]>(
    () => (this.#shouldFetchFromHttp() ? 'records.json' : undefined),
    {
      defaultValue: this.#initialData ?? [],
      parse: (data) => this.#deserializeData(data as AnimalProfileSerialized[]),
    },
  );

  public readonly list = this.#resource.value.asReadonly();
  public readonly loading = this.#resource.isLoading;

  constructor() {
    effect(() => {
      const data = this.#resource.value();
      if (data.length > 0) {
        this.#saveToStorage(data);
      }
    });
  }

  public load(data: AnimalProfile[]): void {
    this.#resource.value.set(data);
  }

  public get(id: string | null): Signal<AnimalProfile | undefined> {
    return computed(() => this.#resource.value().find((record) => record.id === id));
  }

  public set(value: AnimalProfile): void {
    this.#resource.value.update((data) => [
      ...data.filter((record) => record.id !== value.id),
      value,
    ]);
  }

  public delete(id: string): void {
    this.#resource.value.update((data) => data.filter((record) => record.id !== id));
  }

  public toggleNeedsAttention(id: string): void {
    this.#resource.value.update((data) => {
      if (!data.some((record) => record.id === id)) return data;
      return data.map((record) =>
        record.id === id ? { ...record, needsAttention: !record.needsAttention } : record,
      );
    });
  }

  public resetData(): void {
    this.#resource.value.set([]);
    try {
      this.#storage?.removeItem(this.#storageKey);
    } catch (error) {
      /* istanbul ignore start -- @preserve */
      console.warn('Failed to remove from storage:', error);
      /* istanbul ignore stop -- @preserve */
    }
    this.#shouldFetchFromHttp.set(true);
    this.#resource.reload();
  }

  #loadFromStorage(): AnimalProfile[] | undefined {
    try {
      const stored = this.#storage?.getItem(this.#storageKey);
      if (stored) {
        const serialized = JSON.parse(stored) as AnimalProfileSerialized[];
        return this.#deserializeData(serialized);
      }
    } catch (error) {
      console.warn('Failed to load from storage:', error);
    }
    return undefined;
  }

  #saveToStorage(data: AnimalProfile[]): void {
    try {
      const serialized = this.#serializeData(data);
      this.#storage?.setItem(this.#storageKey, JSON.stringify(serialized));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  }

  #deserializeData(data: AnimalProfileSerialized[]): AnimalProfile[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate ? new Date(item.birthdate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }

  #serializeData(data: AnimalProfile[]): AnimalProfileSerialized[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate?.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }
}
