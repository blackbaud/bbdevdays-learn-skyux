import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AnimalProfile } from '../../types/animal-profile';

/**
 * This service provides access to the application's data via a simple API, and
 * sits between the data source and the components that display and manipulate
 * the data.
 */
@Injectable({
  providedIn: 'root',
})
export class DataService {
  readonly #data = new BehaviorSubject<AnimalProfile[]>([]);

  public readonly list: Observable<AnimalProfile[]> = this.#data.asObservable();

  public set(value: AnimalProfile): void {
    this.#data.next([
      ...this.#data.getValue().filter((record) => record.id !== value.id),
      value,
    ]);
  }

  public get(id: string): Observable<AnimalProfile | undefined> {
    return this.#data.pipe(
      map((data) => data.find((record) => record.id === id)),
    );
  }

  public load(data: AnimalProfile[]): void {
    this.#data.next([...data]);
  }

  public delete(id: string): void {
    const data = this.#data.getValue().filter((record) => record.id !== id);
    this.#data.next(data);
  }
}
