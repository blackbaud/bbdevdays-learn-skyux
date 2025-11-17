import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

import { Component, DOCUMENT } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyModalHarness } from '@skyux/modals/testing';

import { Data } from '../../services/data/data';
import { ButtonHarness } from '../../testing/button-harness';
import { AnimalProfile } from '../../types/animal-profile';

import { EditService } from './edit.service';
import { MockData } from '../../services/data/mock-data';
import { Edit } from './edit';

@Component({ template: '' })
class TestComponent {}

describe('Edit', () => {
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
    const { fixture, editService, loader } = await setupTest({
      data: undefined,
    });
    editService.edit();
    fixture.detectChanges();
    await fixture.whenStable();
    await assertModalStatusAndGetHarness(loader);
  });

  it('should cancel', async () => {
    const { fixture, editService, loader } = await setupTest({
      data: undefined,
    });
    editService.edit();
    fixture.detectChanges();
    await fixture.whenStable();
    const { dataServiceSet } = await assertModalStatusAndGetHarness(loader);
    const cancelButton = await loader.getHarness(ButtonHarness.with({ text: 'Cancel' }));
    expect(cancelButton).toBeTruthy();
    await cancelButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dataServiceSet).not.toHaveBeenCalled();
  });

  it('should not save invalid', async () => {
    const { fixture, editService, loader } = await setupTest({
      data: {
        id: 'id',
        name: '',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
    });
    editService.edit('id');
    fixture.detectChanges();
    await fixture.whenStable();
    const { dataServiceSet } = await assertModalStatusAndGetHarness(loader);
    const saveButton = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
    expect(saveButton).toBeTruthy();
    await saveButton.click();
    expect(dataServiceSet).not.toHaveBeenCalled();
  });

  it('should load record', async () => {
    const { fixture, editService, loader } = await setupTest({
      data: {
        id: 'id',
        name: 'name',
        bio: 'bio',
        gender: 'gender',
        breed: 'breed',
        birthdate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        images: [],
      },
    });
    editService.edit('id');
    fixture.detectChanges();
    await fixture.whenStable();
    const { dataServiceSet, waitingHarness } = await assertModalStatusAndGetHarness(loader);
    const inputHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'edit-name' }),
    );
    await (await inputHarness.querySelector('input'))?.setInputValue('updated name');
    const saveButton = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
    expect(saveButton).toBeTruthy();
    await saveButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await waitingHarness.isWaiting()).toBeFalse();
    expect(dataServiceSet).toHaveBeenCalled();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should not load missing record', async () => {
    const { fixture, editService, loader } = await setupTest({
      data: undefined,
    });
    editService.edit('id');
    fixture.detectChanges();
    await fixture.whenStable();
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
    fixture.detectChanges();
    await fixture.whenStable();
    const edit = TestBed.inject(DOCUMENT).querySelector<HTMLElement>('app-edit');
    expect(edit).toBeTruthy();
    await expectAsync(edit).toBeAccessible();
  });
});
