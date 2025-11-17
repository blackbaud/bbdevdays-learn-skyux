import { Injectable, Signal, computed, effect, signal, inject } from '@angular/core';
import { httpResource } from '@angular/common/http';

import { AnimalProfile } from '../../types/animal-profile';
import { AnimalProfileSerialized } from '../../types/animal-profile-serialized';

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

@Injectable({
  providedIn: 'root',
})
export class SessionStorageAdapter implements StorageAdapter {
  getItem(key: string): string | null {
    return sessionStorage.getItem(key);
  }

  setItem(key: string, value: string): void {
    sessionStorage.setItem(key, value);
  }

  removeItem(key: string): void {
    sessionStorage.removeItem(key);
  }
}

@Injectable({
  providedIn: 'root',
})
export class Data {
  private readonly STORAGE_KEY = 'animal-profiles';
  private readonly storage: StorageAdapter = inject(SessionStorageAdapter);

  readonly #data = signal<AnimalProfile[]>([]);
  readonly #loading = signal(false);
  readonly #resource = httpResource<AnimalProfile[]>(signal('records.json').asReadonly(), {
    parse: (data) => this.deserializeData(data as AnimalProfileSerialized[]),
  });

  public readonly list = this.#data.asReadonly();
  public readonly loading = computed(() => this.#loading() || this.#resource.isLoading());

  constructor() {
    // Load from storage first, then fallback to HTTP
    if (!this.loadFromStorage()) {
      this.loadFromHttp();
    }

    // Auto-save to storage when data changes
    effect(() => {
      const data = this.#data();
      if (data.length > 0) {
        this.saveToStorage(data);
      }
    });

    // Handle HTTP resource updates
    effect(() => {
      const data = this.#resource.value();
      if (data) {
        this.#data.set(data);
        this.#loading.set(false);
      }
    });
  }

  public load(data: AnimalProfile[]): void {
    this.#data.set(data);
  }

  public get(id: string | null): Signal<AnimalProfile | undefined> {
    return computed(() => this.#data().find((record) => !!record.id && record.id === id));
  }

  public set(value: AnimalProfile): void {
    this.#data.update((data) => [...data.filter((record) => record.id !== value.id), value]);
  }

  public delete(id: string): void {
    this.#data.update((data) => data.filter((record) => record.id !== id));
  }

  public toggleNeedsAttention(id: string): void {
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

  public resetData(): void {
    this.storage.removeItem(this.STORAGE_KEY);
    this.loadFromHttp();
  }

  private loadFromStorage(): boolean {
    try {
      const stored = this.storage.getItem(this.STORAGE_KEY);
      if (stored) {
        const serialized = JSON.parse(stored) as AnimalProfileSerialized[];
        const data = this.deserializeData(serialized);
        this.#data.set(data);
        return true;
      }
    } catch (error) {
      console.warn('Failed to load from storage:', error);
    }
    return false;
  }

  private loadFromHttp(): void {
    this.#loading.set(true);
    this.#resource.reload();
  }

  private saveToStorage(data: AnimalProfile[]): void {
    try {
      const serialized = this.serializeData(data);
      this.storage.setItem(this.STORAGE_KEY, JSON.stringify(serialized));
    } catch (error) {
      console.warn('Failed to save to storage:', error);
    }
  }

  private deserializeData(data: AnimalProfileSerialized[]): AnimalProfile[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate ? new Date(item.birthdate) : undefined,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt),
    }));
  }

  private serializeData(data: AnimalProfile[]): AnimalProfileSerialized[] {
    return data.map((item) => ({
      ...item,
      birthdate: item.birthdate?.toISOString(),
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
  }
}
