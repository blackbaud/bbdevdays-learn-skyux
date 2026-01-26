import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
  effect,
  inject,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyCountryFieldModule } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';

import { Data } from '../../services/data/data';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';

@Component({
  selector: 'app-edit',
  imports: [
    ReactiveFormsModule,
    SkyCheckboxModule,
    SkyCountryFieldModule,
    SkyDatepickerModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyWaitModule,
  ],
  templateUrl: './edit.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Edit implements OnInit {
  public readonly form = inject(FormBuilder).group<
    Required<Omit<AnimalProfile, 'createdAt' | 'updatedAt' | 'images'>>
  >({
    id: '',
    name: '',
    bio: '',
    gender: '',
    breed: '',
    birthdate: new Date(),
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
  readonly #injector = inject(Injector);

  public ngOnInit(): void {
    this.form.controls.name.addValidators([Validators.required]);
    this.form.controls.gender.addValidators([Validators.required]);
    this.form.controls.breed.addValidators([Validators.required]);
    this.form.controls.birthdate.addValidators([Validators.required]);
    if (this.#id) {
      runInInjectionContext(this.#injector, () => {
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
              birthdate: record.birthdate ?? null,
              needsAttention: !!record.needsAttention,
            });
            this.title.set(`Edit Record`);
            this.loading.set(false);
          }
        });
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
      this.form.get('id')?.setValue(this.#original.id);
      this.title.set(`New Record`);
      this.loading.set(false);
    }
  }

  public saveForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.loading.set(true);
    this.#dataService.set({
      ...this.#original,
      ...this.form.value,
      updatedAt: new Date(),
    } as AnimalProfile);
    this.modalInstance?.close(undefined, 'save', true);
  }

  protected cancel(): void {
    this.modalInstance?.cancel();
  }
}
