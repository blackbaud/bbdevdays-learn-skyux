import { Service, inject } from '@angular/core';
import { SkyModalService } from '@skyux/modals';

import { ID } from '../../types/id';

import { Edit } from './edit';

@Service()
export class EditModal {
  readonly #modalService = inject(SkyModalService);

  public edit(id?: string): void {
    this.#modalService.open(Edit, {
      providers: [
        {
          provide: ID,
          useValue: id ?? '',
        },
      ],
    });
  }
}
