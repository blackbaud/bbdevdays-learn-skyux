import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyFlyoutHarness } from '@skyux/flyout/testing';
import { SkyConfirmType } from '@skyux/modals';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';

import { AgGridAngular } from 'ag-grid-angular';
import { IRowNode } from 'ag-grid-community';

import { DataService } from '../../services/data/data.service';
import { MockPersistenceService } from '../../services/data/mock-persistence.service';
import { PersistenceService } from '../../services/data/persistence.service';
import { ButtonHarness } from '../../testing/button-harness';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { EditComponent } from '../edit/edit.component';

import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let harnessLoader: HarnessLoader;
  let rootHarnessLoader: HarnessLoader;
  let confirmController: SkyConfirmTestingController;
  let modalController: SkyModalTestingController;
  let loadData: () => Promise<void>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [ListComponent, SkyConfirmTestingModule, SkyModalTestingModule],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        provideNoopAnimations(),
        MockPersistenceService,
        {
          provide: PersistenceService,
          useExisting: MockPersistenceService,
        },
      ],
    });
    TestBed.inject(MockPersistenceService).loading.set(true);
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    rootHarnessLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    confirmController = TestBed.inject(SkyConfirmTestingController);
    modalController = TestBed.inject(SkyModalTestingController);
    expect(component).toBeTruthy();
    loadData = async () => {
      TestBed.inject(DataService).load([
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
      TestBed.inject(MockPersistenceService).loading.set(false);
      fixture.detectChanges();
      await fixture.whenStable();
    };
  });

  it('should reset data', async () => {
    const resetButton = await harnessLoader.getHarness(
      ButtonHarness.with({ selector: 'button.reset-data' }),
    );
    expect(resetButton).toBeTruthy();
    expect(await resetButton.getText()).toEqual('Reset data');
    await resetButton.click();
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
    component.onViewClick('id1', 'name1');
    fixture.detectChanges();
    await fixture.whenStable();
    const flyout = await rootHarnessLoader.getHarness(SkyFlyoutHarness);
    expect(flyout).toBeTruthy();
    expect(await flyout.getPrimaryActionButtonLabel()).toEqual('Edit');
    expect(await flyout.getAriaLabel()).toEqual('Record for name1');
    await flyout.clickPrimaryActionButton();
    modalController.expectOpen(EditComponent);
  });

  it('should link to next view record', async () => {
    component.focusOnRow(2, {
      id: 'id2',
      data: {
        name: 'name2',
      },
    } as unknown as IRowNode<AnimalProfileRow>);
    fixture.detectChanges();
    await fixture.whenStable();
    const flyout = await rootHarnessLoader.getHarness(SkyFlyoutHarness);
    expect(flyout).toBeTruthy();
    expect(await flyout.getPrimaryActionButtonLabel()).toEqual('Edit');
    expect(await flyout.getAriaLabel()).toEqual('Record for name2');
    await flyout.clickPrimaryActionButton();
    modalController.expectOpen(EditComponent);
  });

  it('should toggle the needs attention flag', async () => {
    const dataService = TestBed.inject(DataService);
    spyOn(dataService, 'toggleNeedsAttention');
    component.toggleNeedsAttention('id1');
    expect(dataService.toggleNeedsAttention).toHaveBeenCalledOnceWith('id1');
  });

  it('should delete a record', async () => {
    const deleteSpy = spyOn(TestBed.inject(DataService), 'delete');
    component.onDeleteClick('id1');
    expect(component.rowDeleteIds()).toEqual(['id1']);
    component.rowDeleteConfirm({ id: 'id1' });
    expect(component.rowDeleteIds()).toEqual([]);
    expect(deleteSpy).toHaveBeenCalledOnceWith('id1');
  });

  it('should be accessible', async () => {
    await loadData();
    const agGrid = fixture.debugElement.query(By.directive(AgGridAngular));
    expect(agGrid).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  });
});
