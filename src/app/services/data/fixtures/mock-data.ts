import { Injectable, computed, signal } from '@angular/core';
import { AnimalProfile } from '../../../types/animal-profile';

@Injectable()
export class MockData {
  readonly #data = signal<AnimalProfile[]>([]);
  readonly loading = signal(false);

  public readonly list = this.#data.asReadonly();

  public load(data: AnimalProfile[]): void {
    this.#data.set(data);
  }

  public get(id: string | null) {
    return computed(() => this.#data().find((record) => record.id === id));
  }

  public set(value: AnimalProfile): void {
    this.#data.update((data) => [...data.filter((record) => record.id !== value.id), value]);
  }

  public delete(id: string): void {
    this.#data.update((data) => data.filter((record) => record.id !== id));
  }

  public toggleNeedsAttention(id: string): void {
    this.#data.update((data) => {
      if (!data.some((record) => record.id === id)) return data;
      return data.map((record) =>
        record.id === id ? { ...record, needsAttention: !record.needsAttention } : record,
      );
    });
  }

  public resetData(): void {
    this.#data.set([]);
  }
}
