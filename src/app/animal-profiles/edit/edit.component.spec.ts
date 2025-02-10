import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyInputBoxHarness } from '@skyux/forms/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyModalHarness } from '@skyux/modals/testing';
import { DataService } from '../../services/data/data.service';
import { AnimalProfile } from '../../types/animal-profile';
import { EditComponent } from './edit.component';
import { EditService } from './edit.service';
import { DOCUMENT } from '@angular/common';

@Component({
  template: '',
})
class TestComponent {}

describe('EditComponent', () => {
  let fixture: ComponentFixture<TestComponent>;
  let editService: EditService;
  let loader: HarnessLoader;

  async function setupTest(options: { data?: AnimalProfile | undefined }) {
    TestBed.configureTestingModule({
      imports: [EditComponent],
      providers: [provideLocationMocks(), provideRouter([])],
    });
    if (options.data) {
      TestBed.inject(DataService).load([options.data]);
    }
    fixture = TestBed.createComponent(TestComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    editService = TestBed.inject(EditService);
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
  }

  it('should create', async () => {
    await setupTest({ data: undefined });
    editService.edit();
    fixture.detectChanges();
    await fixture.whenStable();
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({ dataSkyId: 'edit' }),
    );
    expect(await modalHarness.isDirty()).toBeFalse();
    const inputHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'edit-name' }),
    );
    expect(await inputHarness.getLabelText()).toBe('Name');
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeFalse();
  });

  it('should cancel', async () => {
    await setupTest({ data: undefined });
    editService.edit();
    fixture.detectChanges();
    await fixture.whenStable();
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({ dataSkyId: 'edit' }),
    );
    expect(await modalHarness.isDirty()).toBeFalse();
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeFalse();
    const dataService = TestBed.inject(DataService);
    const dataServiceSet = spyOn(dataService, 'set');
    const modalElement = TestbedHarnessEnvironment.getNativeElement(
      await modalHarness.host(),
    );
    const cancelButton = modalElement.querySelector<HTMLElement>(
      'sky-modal-footer button[type="button"]',
    );
    expect(cancelButton).toBeTruthy();
    expect(cancelButton?.textContent?.trim()).toBe('Cancel');
    cancelButton?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dataServiceSet).not.toHaveBeenCalled();
  });

  it('should not save invalid', async () => {
    await setupTest({
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
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({ dataSkyId: 'edit' }),
    );
    expect(await modalHarness.isDirty()).toBeFalse();
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeFalse();
    const dataService = TestBed.inject(DataService);
    const dataServiceSet = spyOn(dataService, 'set');
    const modalElement = TestbedHarnessEnvironment.getNativeElement(
      await modalHarness.host(),
    );
    modalElement.querySelector<HTMLElement>('button[type="submit"]')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(dataServiceSet).not.toHaveBeenCalled();
  });

  it('should load record', async () => {
    await setupTest({
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
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeFalse();
    const modalHarness = await loader.getHarness(
      SkyModalHarness.with({ dataSkyId: 'edit' }),
    );
    expect(await modalHarness.isDirty()).toBeFalse();
    const dataService = TestBed.inject(DataService);
    const dataServiceSet = spyOn(dataService, 'set');
    const modalElement = TestbedHarnessEnvironment.getNativeElement(
      await modalHarness.host(),
    );
    const inputHarness = await loader.getHarness(
      SkyInputBoxHarness.with({ dataSkyId: 'edit-name' }),
    );
    await (
      await inputHarness.querySelector('input')
    )?.setInputValue('updated name');
    modalElement.querySelector<HTMLElement>('button[type="submit"]')?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await waitingHarness.isWaiting()).toBeFalse();
    expect(dataServiceSet).toHaveBeenCalled();
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should not load missing record', async () => {
    await setupTest({ data: undefined });
    editService.edit('id');
    fixture.detectChanges();
    await fixture.whenStable();
    const waitingHarness = await loader.getHarness(
      SkyWaitHarness.with({ dataSkyId: 'edit-loading' }),
    );
    expect(await waitingHarness.isWaiting()).toBeTrue();
  });

  it('should be accessible', async () => {
    await setupTest({ data: undefined });
    editService.edit();
    fixture.detectChanges();
    await fixture.whenStable();
    const edit =
      TestBed.inject(DOCUMENT).querySelector<HTMLElement>('app-edit');
    expect(edit).toBeTruthy();
    await expectAsync(edit).toBeAccessible();
  }, 1e6);
});
