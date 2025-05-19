import { Injectable, signal } from '@angular/core';
import { PersistenceServiceInterface } from './persistence-service-interface';

@Injectable()
export class MockPersistenceService implements PersistenceServiceInterface {
  public readonly loading = signal(false);

  public resetData(): void {
    // No-op for mock service
  }
}
