import { Injectable } from '@angular/core';
import { AnimalProfile } from '../../types/animal-profile';
import { BehaviorSubject, Observable } from 'rxjs';

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

  public load(data: AnimalProfile[]): void {
    this.#data.next([...data]);
  }

  public delete(id: string): void {
    const data = this.#data.getValue().filter((record) => record.id !== id);
    this.#data.next(data);
  }
}
