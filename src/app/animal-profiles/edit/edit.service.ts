import { inject, Injectable } from '@angular/core';
import { SkyModalService } from '@skyux/modals';
import { EditComponent } from './edit.component';
import { ID } from '../../types/id';

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
