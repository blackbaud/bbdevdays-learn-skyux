import { BaseHarnessFilters } from '@angular/cdk/testing';

export interface ElementHarnessFilters extends BaseHarnessFilters {
  text?: string | RegExp;
}
