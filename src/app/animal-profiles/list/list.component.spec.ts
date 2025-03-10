import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { By } from '@angular/platform-browser';
import { SkyDropdownHarness } from '@skyux/popovers/testing';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';
import { firstValueFrom } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { MockStorageService } from '../../services/session-storage/mock-storage.service';
import { SESSION_STORAGE } from '../../services/session-storage/session-storage.service';
import { EditComponent } from '../edit/edit.component';
import { ListComponent } from './list.component';
import { SkyConfirmType } from '@skyux/modals';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let httpTesting: HttpTestingController;
  let harnessLoader: HarnessLoader;
  let waitHarness: SkyWaitHarness;
  let confirmController: SkyConfirmTestingController;
  let modalController: SkyModalTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ListComponent, SkyConfirmTestingModule, SkyModalTestingModule],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        MockStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockStorageService,
        },
      ],
    });
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    waitHarness = await harnessLoader.getHarness(
      SkyWaitHarness.with({
        dataSkyId: 'wait',
      }),
    );
    httpTesting = TestBed.inject(HttpTestingController);
    confirmController = TestBed.inject(SkyConfirmTestingController);
    modalController = TestBed.inject(SkyModalTestingController);
    expect(component).toBeTruthy();
    expect(await waitHarness.isWaiting()).toBeTrue();
    const req = httpTesting.expectOne('records.json');
    expect(req.request.method).toEqual('GET');
    req.flush([
      {
        bio: 'bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        breed: 'breed',
        name: 'name1',
        gender: '',
        images: [],
        id: 'id1',
        needsAttention: true,
      },
      {
        bio: 'bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        breed: 'breed',
        name: 'name2',
        gender: '',
        images: [],
        id: 'id2',
        needsAttention: false,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await waitHarness.isWaiting()).toBeFalse();
  });

  it('should reset data', async () => {
    const resetButton = fixture.debugElement.query(By.css('button.reset-data'));
    expect(resetButton).toBeTruthy();
    expect(
      (resetButton?.nativeElement as HTMLButtonElement)?.textContent?.trim(),
    ).toEqual('Reset data');
    resetButton?.triggerEventHandler('click');
    fixture.detectChanges();
    await fixture.whenStable();
    confirmController.expectOpen({
      type: SkyConfirmType.Custom,
      body: `Are you sure you want to reset the data? This will clear changes in
       local storage and reload data from the server.`,
      buttons: [
        {
          styleType: 'primary',
          text: 'Reset data',
          action: 'reset',
        },
        {
          text: 'Cancel',
          action: 'cancel',
        },
      ],
      message: 'Reset Data',
    });
    confirmController.close({ action: 'reset' });
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should link to view record', async () => {
    const linkColumn = fixture.debugElement.query(By.css('button.link-column'));
    expect(linkColumn).toBeTruthy();
    linkColumn.triggerEventHandler('click');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(
      (fixture.nativeElement as HTMLElement).ownerDocument.querySelector(
        'sky-flyout',
      ),
    ).toBeTruthy();
    const flyoutAction = (
      fixture.nativeElement as HTMLElement
    ).ownerDocument.querySelector('button.sky-flyout-btn-primary-action');
    expect(flyoutAction).toBeTruthy();
    (flyoutAction as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    modalController.expectOpen(EditComponent);
  });

  it('should link to edit record', async () => {
    const dropdown = await harnessLoader.getHarness(
      SkyDropdownHarness.with({
        dataSkyId: 'dropdown',
      }),
    );
    await dropdown.clickDropdownButton();
    const dropdownMenu = await dropdown.getDropdownMenu();
    const editButton = await dropdownMenu.getItem({ text: 'Edit' });
    await editButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    modalController.expectOpen(EditComponent);
  });

  it('should link to delete record, cancel', async () => {
    const dropdown = await harnessLoader.getHarness(
      SkyDropdownHarness.with({
        dataSkyId: 'dropdown',
      }),
    );
    await dropdown.clickDropdownButton();
    const dropdownMenu = await dropdown.getDropdownMenu();
    const deleteButton = await dropdownMenu.getItem({ text: 'Delete' });
    await deleteButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const inlineDelete = (
      fixture.nativeElement as HTMLElement
    ).ownerDocument.querySelector<HTMLElement>('sky-inline-delete');
    expect(inlineDelete).toBeTruthy();
    const button: HTMLButtonElement | undefined =
      inlineDelete?.querySelector('button.sky-btn-default') ?? undefined;
    expect(button).toBeTruthy();
    button?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inlineDelete?.clientHeight).toBeFalsy();
  });

  it('should link to delete record, delete', async () => {
    const dropdown = await harnessLoader.getHarness(
      SkyDropdownHarness.with({
        dataSkyId: 'dropdown',
      }),
    );
    await dropdown.clickDropdownButton();
    const dropdownMenu = await dropdown.getDropdownMenu();
    const deleteButton = await dropdownMenu.getItem({ text: 'Delete' });
    await deleteButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    const inlineDelete = (
      fixture.nativeElement as HTMLElement
    ).ownerDocument.querySelector<HTMLElement>('sky-inline-delete');
    expect(inlineDelete).toBeTruthy();
    const button: HTMLButtonElement | undefined =
      inlineDelete?.querySelector('button.sky-inline-delete-button') ??
      undefined;
    expect(button).toBeTruthy();
    button?.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(inlineDelete?.clientHeight).toBeFalsy();
    expect(await firstValueFrom(TestBed.inject(DataService).list)).toHaveSize(
      1,
    );
  });

  it('should be accessible', async () => {
    expect(component).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  }, 1e6);
});
