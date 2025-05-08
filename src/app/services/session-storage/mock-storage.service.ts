import { Injectable } from '@angular/core';

/**
 * Mock service that works like session storage, for testing.
 */
@Injectable()
export class MockStorageService implements Storage {
  #storage: Record<string, string> = {};

  public get length(): number {
    return Object.keys(this.#storage).length;
  }

  public clear(): void {
    this.#storage = {};
  }

  public getItem(key: string): string | null {
    return this.#storage[key] ?? null;
  }

  public key(index: number): string | null {
    return Object.keys(this.#storage)[index] ?? null;
  }

  public removeItem(key: string): void {
    delete this.#storage[key];
  }

  public setItem(key: string, value: string): void {
    this.#storage[key] = value;
  }
}
