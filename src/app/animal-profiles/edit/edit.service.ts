import { Injectable, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ID } from '../../types/id';

import { EditComponent } from './edit.component';

@Injectable({
  providedIn: 'root',
})
export class EditService {
  readonly #modalService = inject(SkyModalService);

  public edit(id?: string): void {
    this.#modalService.open(EditComponent, {
      providers: [
        {
          provide: ID,
          useValue: id ?? '',
        },
      ],
    });
  }
}
