import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
  DestroyRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CRYPTO } from '@ng-web-apis/common';
import { SkyDatepickerModule } from '@skyux/datetime';
import { SkyCheckboxModule, SkyInputBoxModule } from '@skyux/forms';
import { SkyWaitModule } from '@skyux/indicators';
import { SkyCountryFieldModule } from '@skyux/lookup';
import { SkyModalInstance, SkyModalModule } from '@skyux/modals';
import { take } from 'rxjs';

import { DataService } from '../../services/data/data.service';
import { AnimalProfile } from '../../types/animal-profile';
import { ID } from '../../types/id';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SkyCountryFieldModule,
    SkyInputBoxModule,
    SkyModalModule,
    SkyWaitModule,
    SkyDatepickerModule,
    SkyCheckboxModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditComponent implements OnInit {
  public readonly form: FormGroup;

  protected readonly loading = signal(true);
  protected readonly maxDate = new Date();
  protected readonly modalInstance = inject(SkyModalInstance, {
    optional: true,
  });
  protected readonly title = signal('Loading...');

  #original: AnimalProfile | undefined = undefined;
  readonly #crypto = inject(CRYPTO);
  readonly #id = inject(ID, { optional: true });
  readonly #dataService = inject(DataService);
  readonly #destroyRef = inject(DestroyRef);

  constructor() {
    const formBuilder = inject(FormBuilder);
    this.form = formBuilder.group<
      Omit<AnimalProfile, 'createdAt' | 'updatedAt' | 'images'>
    >({
      id: '',
      name: '',
      bio: '',
      gender: '',
      breed: '',
      birthdate: new Date(),
      needsAttention: false,
    });
  }
  public ngOnInit(): void {
    this.form.controls['name'].addValidators([Validators.required]);
    this.form.controls['gender'].addValidators([Validators.required]);
    this.form.controls['breed'].addValidators([Validators.required]);
    this.form.controls['birthdate'].addValidators([Validators.required]);
    if (this.#id) {
      this.#dataService.list
        .pipe(take(1), takeUntilDestroyed(this.#destroyRef))
        .subscribe((data) => {
          const record = data.find((record) => record.id === this.#id);
          if (record) {
            this.#original = record;
            this.form.setValue({
              id: record.id,
              name: record.name,
              bio: record.bio,
              gender: record.gender,
              breed: record.breed,
              birthdate: record.birthdate,
              needsAttention: !!record.needsAttention,
            });
            this.title.set(`Edit Record`);
            this.loading.set(false);
          }
        });
    } else {
      const id = this.#crypto.randomUUID();
      this.#original = {
        id,
        name: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        bio: '',
        images: [],
        birthdate: new Date(),
        breed: '',
        gender: '',
      };
      this.form.get('id')?.setValue(id);
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

  protected cancel() {
    this.modalInstance?.cancel();
  }
}
