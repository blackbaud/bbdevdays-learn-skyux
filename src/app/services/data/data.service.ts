import { computed, Injectable, Signal, signal } from '@angular/core';
import { AnimalProfile } from '../../types/animal-profile';

/**
 * This service provides access to the application's data via a simple API and
 * sits between the data source and the components that display and manipulate
 * the data.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly #data = signal<AnimalProfile[]>([]);

  public readonly list: Signal<AnimalProfile[]> = this.#data.asReadonly();

  public set(value: AnimalProfile): void {
    this.#data.update((data) => [
      ...data.filter((record) => record.id !== value.id),
      value,
    ]);
  }

  public get(id: string | null): Signal<AnimalProfile | undefined> {
    return computed(() =>
      this.#data().find((record) => !!record.id && record.id === id),
    );
  }

  public load(data: AnimalProfile[]): void {
    this.#data.set([...data]);
  }

  public delete(id: string): void {
    this.#data.update((data) => data.filter((record) => record.id !== id));
  }

  public toggleNeedsAttention(id: string) {
    this.#data.update((data) => {
      const record = data.find((record) => record.id === id);
      if (record) {
        return [
          ...data.filter((record) => record.id !== id),
          { ...record, needsAttention: !record.needsAttention },
        ];
      }
      return data;
    });
  }
}
