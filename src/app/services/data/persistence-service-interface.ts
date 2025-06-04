import { Signal } from '@angular/core';

export interface PersistenceServiceInterface {
  loading: Signal<boolean>;
  resetData: () => void;
}
