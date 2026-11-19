import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyButton, SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Data } from '../../services/data/data';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    SkyButton,
    SkyCheckboxModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyWaitModule,
  ],
  templateUrl: './edit.html',
})
export class Edit {
  public readonly form = inject(FormBuilder).nonNullable.group({
    name: ['', [Validators.required]],
    bio: '',
    gender: ['', [Validators.required]],
    breed: ['', [Validators.required]],
    birthdate: [new Date(), [Validators.required]],
    needsAttention: false,
  });

  readonly #id = inject(ID, { optional: true });
  readonly #dataService = inject(Data);
  readonly #record = this.#id ? this.#dataService.get(this.#id) : signal(undefined);

  protected readonly loading = computed(() => Boolean(this.#id && !this.#record()));
  protected readonly title = computed(() => {
    if (!this.#id) {
      return 'New Record';
    }
    return this.#record() ? 'Edit Record' : 'Loading...';
  });
  protected readonly maxDate = new Date();
  protected readonly modalInstance = inject(SkyModalInstance, {
    optional: true,
  });

  #original: AnimalProfile | undefined = this.#id
    ? undefined
    : {
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

  constructor() {
    if (this.#id) {
      effect(() => {
        const record = this.#record();
        if (record && !this.#original) {
          this.#original = record;
          this.form.setValue({
            name: record.name,
            bio: record.bio,
            gender: record.gender,
            breed: record.breed,
            birthdate: record.birthdate ?? new Date(),
            needsAttention: !!record.needsAttention,
          });
        }
      });
    }
  }

  public saveForm(): void {
    if (this.form.invalid || !this.#original) {
      return;
    }
    const raw = this.form.getRawValue();
    const updated: AnimalProfile = {
      ...this.#original,
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
