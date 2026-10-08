import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { Component, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyDatepickerHarness } from '@skyux/datetime/testing';
import { SkyCheckboxHarness, SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Data } from '../../services/data/data';
import { ButtonHarness } from '../../testing/button-harness';
import { AnimalProfile } from '../../types/animal-profile';

import { EditService } from './edit.service';
import { MockData } from '../../services/data/fixtures/mock-data';
import { Edit } from './edit';

@Component({ template: '' })
class TestComponent {}

function createProfile(overrides: Partial<AnimalProfile> = {}): AnimalProfile {
  return {
    id: 'id',
    name: 'Rex',
    bio: 'bio',
    gender: 'male',
    breed: 'Labrador',
    birthdate: new Date('2020-01-01'),
    createdAt: new Date(),
    updatedAt: new Date(),
    images: [],
    ...overrides,
  };
}

describe('Edit', () => {
  async function stabilize(fixture: ComponentFixture<unknown>): Promise<void> {
    fixture.detectChanges();
    await fixture.whenStable();
  }

  async function setupTest(options: { data?: AnimalProfile | undefined }): Promise<{
    fixture: ComponentFixture<TestComponent>;
    editService: EditService;
    loader: HarnessLoader;
  }> {
    TestBed.configureTestingModule({
      imports: [Edit],
      providers: [
        MockData,
        {
          provide: Data,
          useExisting: MockData,
        },
      ],
    });
    if (options.data) {
      TestBed.inject(Data).load([options.data]);
    }
    const fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    const editService = TestBed.inject(EditService);
    const loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    return { fixture, editService, loader };
  }

  async function openEdit(options: { data?: AnimalProfile | undefined; id?: string }): Promise<{
    fixture: ComponentFixture<TestComponent>;
    editService: EditService;
    loader: HarnessLoader;
  }> {
    const testContext = await setupTest({ data: options.data });

    if (options.id) {
      testContext.editService.edit(options.id);
    } else {
      testContext.editService.edit();
    }

    await stabilize(testContext.fixture);
    return testContext;
  }

  async function assertModalStatusAndGetHarness(loader: HarnessLoader): Promise<{
    dataServiceSet: jasmine.Spy;
    modalHarness: SkyModalHarness;
    waitingHarness: SkyWaitHarness;
  }> {
    const modalHarness = await loader.getHarness(SkyModalHarness.with({ dataSkyId: 'edit' }));
    expect(await modalHarness.isDirty()).toBeFalse();
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeFalse();
    const dataService = TestBed.inject(Data);
    const dataServiceSet = spyOn(dataService, 'set');
    return { dataServiceSet, modalHarness, waitingHarness };
  }

  it('should create', async () => {
    const { loader } = await openEdit({
      data: undefined,
    });
    await assertModalStatusAndGetHarness(loader);
  });

  it('should cancel', async () => {
    const { fixture, loader } = await openEdit({
      data: undefined,
    });
    const { dataServiceSet } = await assertModalStatusAndGetHarness(loader);
    const cancelButton = await loader.getHarness(ButtonHarness.with({ text: 'Cancel' }));
    expect(cancelButton).toBeTruthy();
    await cancelButton.click();
    await stabilize(fixture);
    expect(dataServiceSet).not.toHaveBeenCalled();
  });

  it('should not save invalid', async () => {
    const { loader } = await openEdit({
      data: createProfile({
        name: '',
        gender: 'gender',
        breed: 'breed',
        birthdate: undefined,
      }),
      id: 'id',
    });
    const { dataServiceSet } = await assertModalStatusAndGetHarness(loader);
    const saveButton = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
    expect(saveButton).toBeTruthy();
    await saveButton.click();
    expect(dataServiceSet).not.toHaveBeenCalled();
  });

  it('should load record', async () => {
    const { fixture, loader } = await openEdit({
      data: createProfile({
        name: 'name',
        gender: 'gender',
        breed: 'breed',
        birthdate: new Date(),
      }),
      id: 'id',
    });
    const { dataServiceSet, waitingHarness } = await assertModalStatusAndGetHarness(loader);
    const inputHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'edit-name' }),
    );
    await (await inputHarness.querySelector('input'))?.setInputValue('updated name');
    const saveButton = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
    expect(saveButton).toBeTruthy();
    await saveButton.click();
    await stabilize(fixture);
    expect(await waitingHarness.isWaiting()).toBeFalse();
    expect(dataServiceSet).toHaveBeenCalled();
  });

  it('should not load missing record', async () => {
    const { loader } = await openEdit({
      data: undefined,
      id: 'id',
    });
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeTrue();
  });

  it('should be accessible', async () => {
    const { fixture, editService } = await setupTest({
      data: undefined,
    });
    editService.edit();
    await stabilize(fixture);
    const edit = TestBed.inject(DOCUMENT).querySelector<HTMLElement>('app-edit');
    expect(edit).toBeTruthy();
    await expectAsync(edit).toBeAccessible();
  });

  it('should show "New Record" heading for a new modal', async () => {
    const { loader } = await openEdit({ data: undefined });
    const modalHarness = await loader.getHarness(SkyModalHarness.with({ dataSkyId: 'edit' }));

    expect(await modalHarness.getHeadingText()).toBe('New Record');
  });

  it('should show "Edit Record" heading when editing an existing record', async () => {
    const { loader } = await openEdit({
      data: createProfile(),
      id: 'id',
    });
    const modalHarness = await loader.getHarness(SkyModalHarness.with({ dataSkyId: 'edit' }));

    expect(await modalHarness.getHeadingText()).toBe('Edit Record');
  });

  it('should mark modal dirty when a form field is changed', async () => {
    const { fixture, loader } = await openEdit({ data: undefined });
    const modalHarness = await loader.getHarness(SkyModalHarness.with({ dataSkyId: 'edit' }));

    expect(await modalHarness.isDirty()).toBe(false);

    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'edit-needsAttention' }),
    );
    await checkboxHarness.check();
    await stabilize(fixture);

    expect(await modalHarness.isDirty()).toBe(true);
  });

  it('should render input box labels correctly', async () => {
    const { loader } = await openEdit({ data: undefined });
    const labelTexts = await Promise.all(
      ['edit-name', 'edit-bio', 'edit-gender', 'edit-breed', 'edit-birthdate'].map(async (id) =>
        (await loader.getHarness(SkyInputBoxHarness.with({ dataSkyId: id }))).getLabelText(),
      ),
    );

    expect(labelTexts).toEqual(['Name', 'Bio', 'Gender', 'Breed', 'Birthdate']);
  });

  it('should render needsAttention checkbox unchecked by default', async () => {
    const { loader } = await openEdit({ data: undefined });
    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'edit-needsAttention' }),
    );

    expect(await checkboxHarness.isChecked()).toBe(false);
    expect(await checkboxHarness.getLabelText()).toBe('Needs attention');
  });

  it('should toggle needsAttention checkbox', async () => {
    const { fixture, loader } = await openEdit({ data: undefined });
    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'edit-needsAttention' }),
    );

    await checkboxHarness.check();
    await stabilize(fixture);
    expect(await checkboxHarness.isChecked()).toBe(true);

    await checkboxHarness.uncheck();
    await stabilize(fixture);
    expect(await checkboxHarness.isChecked()).toBe(false);
  });

  it('should reflect needsAttention value from loaded record', async () => {
    const { loader } = await openEdit({
      data: createProfile({
        needsAttention: true,
      }),
      id: 'id',
    });
    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'edit-needsAttention' }),
    );

    expect(await checkboxHarness.isChecked()).toBe(true);
  });

  it('should save the updated birthdate set through the datepicker harness', async () => {
    const { fixture, loader } = await openEdit({
      data: createProfile(),
      id: 'id',
    });
    const { dataServiceSet } = await assertModalStatusAndGetHarness(loader);
    const birthdateInputBox = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'edit-birthdate' }),
    );
    const datepickerHarness = await birthdateInputBox.queryHarness(SkyDatepickerHarness);
    const datepickerInput = await datepickerHarness.getControl();

    await datepickerInput.setValue('2019-06-15');
    await datepickerInput.blur();
    await stabilize(fixture);
    expect(await birthdateInputBox.hasInvalidDateError()).toBe(false);

    const saveButton = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
    await saveButton.click();
    await stabilize(fixture);

    const savedRecord = dataServiceSet.calls.mostRecent().args[0] as AnimalProfile;

    expect(savedRecord.birthdate).toEqual(jasmine.any(Date));
    expect(savedRecord.birthdate?.getFullYear()).toBe(2019);
    expect(savedRecord.birthdate?.getMonth()).toBe(5);
    expect(savedRecord.birthdate?.getDate()).toBe(15);
  });

  it('should save record with toggled needsAttention', async () => {
    const { fixture, loader } = await openEdit({
      data: createProfile(),
      id: 'id',
    });
    const { dataServiceSet } = await assertModalStatusAndGetHarness(loader);
    const checkboxHarness = await loader.getHarness(
      SkyCheckboxHarness.with({ dataSkyId: 'edit-needsAttention' }),
    );

    await checkboxHarness.check();

    const saveButton = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
    await saveButton.click();
    await stabilize(fixture);

    expect(dataServiceSet).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 'id', needsAttention: true }),
    );
  });
});
