import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Data } from '../../services/data/data';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyWaitModule,
  ],
  templateUrl: './edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit {
  public readonly form = inject(FormBuilder).nonNullable.group({
    id: '',
    name: ['', [Validators.required]],
    bio: '',
    gender: ['', [Validators.required]],
    breed: ['', [Validators.required]],
    birthdate: [new Date(), [Validators.required]],
    needsAttention: false,
  });

  protected readonly loading = signal(true);
  protected readonly maxDate = new Date();
  protected readonly modalInstance = inject(SkyModalInstance, {
    optional: true,
  });
  protected readonly title = signal('Loading...');

  #original: AnimalProfile | undefined = undefined;
  readonly #id = inject(ID, { optional: true });
  readonly #dataService = inject(Data);

  constructor() {
    if (this.#id) {
      effect(() => {
        const record = this.#dataService.get(this.#id)();
        if (record) {
          this.#original = record;
          this.form.setValue({
            id: record.id,
            name: record.name,
            bio: record.bio,
            gender: record.gender,
            breed: record.breed,
            birthdate: record.birthdate ?? new Date(),
            needsAttention: !!record.needsAttention,
          });
          this.title.set('Edit Record');
          this.loading.set(false);
        }
      });
    } else {
      this.#original = {
        id: crypto.randomUUID(),
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        bio: '',
        images: [],
        birthdate: new Date(),
        breed: '',
        gender: '',
      };
      this.form.controls.id.setValue(this.#original.id);
      this.title.set('New Record');
      this.loading.set(false);
    }
  }

  public saveForm(): void {
    if (this.form.invalid || !this.#original) {
      return;
    }
    this.loading.set(true);
    const raw = this.form.getRawValue();
    const updated: AnimalProfile = {
      ...this.#original,
      id: raw.id,
      name: raw.name,
      bio: raw.bio,
      gender: raw.gender,
      breed: raw.breed,
      birthdate: raw.birthdate,
      needsAttention: raw.needsAttention,
      updatedAt: new Date(),
    };
    this.#dataService.set(updated);
    this.modalInstance?.close(undefined, 'save', true);
  }

  protected cancel(): void {
    this.modalInstance?.cancel();
  }
}
