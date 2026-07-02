import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyAgGridWrapperHarness } from '@skyux/ag-grid/testing';
import { SkyDataManagerHarness, SkyDataManagerToolbarHarness } from '@skyux/data-manager/testing';
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

import { Data } from '../../services/data/data';
import { ButtonHarness } from '../../testing/button-harness';
import { AnimalProfileRow } from '../../types/animal-profile-row';
import { Edit } from '../edit/edit';

import { List } from './list';
import { MockData } from '../../services/data/fixtures/mock-data';

describe('List', () => {
  let component: List;
  let fixture: ComponentFixture<List>;
  let harnessLoader: HarnessLoader;
  let rootHarnessLoader: HarnessLoader;
  let confirmController: SkyConfirmTestingController;
  let modalController: SkyModalTestingController;
  let loadData: () => Promise<void>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [List, SkyConfirmTestingModule, SkyModalTestingModule],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        MockData,
        {
          provide: Data,
          useExisting: MockData,
        },
      ],
    });
    TestBed.inject(MockData).loading.set(true);
    fixture = TestBed.createComponent(List);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
    rootHarnessLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    confirmController = TestBed.inject(SkyConfirmTestingController);
    modalController = TestBed.inject(SkyModalTestingController);
    expect(component).toBeTruthy();
    loadData = async () => {
      TestBed.inject(Data).load([
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
      TestBed.inject(MockData).loading.set(false);
      fixture.detectChanges();
      await fixture.whenStable();
    };
  });

  it('should cancel reset data', async () => {
    const resetSpy = spyOn(TestBed.inject(Data), 'resetData');
    const resetButton = await harnessLoader.getHarness(
      ButtonHarness.with({ selector: 'button.reset-data' }),
    );
    expect(await resetButton.getText()).toBe('Reset data');
    await resetButton.click();
    fixture.detectChanges();
    await fixture.whenStable();
    confirmController.expectOpen({ message: 'Reset Data' });
    confirmController.close({ action: 'cancel' });
    fixture.detectChanges();
    await fixture.whenStable();
    expect(resetSpy).not.toHaveBeenCalled();
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
    modalController.expectOpen(Edit);
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
    modalController.expectOpen(Edit);
  });

  it('should toggle the needs attention flag', async () => {
    const dataService = TestBed.inject(Data);
    spyOn(dataService, 'toggleNeedsAttention');
    const row = { id: 'id1', needsAttention: true };
    component.toggleNeedsAttention(row);
    expect(dataService.toggleNeedsAttention).toHaveBeenCalledOnceWith(row.id);
  });

  it('should delete a record', async () => {
    const deleteSpy = spyOn(TestBed.inject(Data), 'delete');
    component.onDeleteClick('id1');
    expect(component.rowDeleteIds()).toEqual(['id1']);
    component.rowDeleteConfirm({ id: 'id1' });
    expect(component.rowDeleteIds()).toEqual([]);
    expect(deleteSpy).toHaveBeenCalledOnceWith('id1');
  });

  it('should be accessible', async () => {
    await loadData();
    const agGridHarness = await harnessLoader.getHarness(SkyAgGridWrapperHarness);
    expect(await agGridHarness.isGridReady()).toBe(true);
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  });

  describe('data manager harness', () => {
    let dataManagerHarness: SkyDataManagerHarness;
    let toolbarHarness: SkyDataManagerToolbarHarness;

    beforeEach(async () => {
      dataManagerHarness = await harnessLoader.getHarness(SkyDataManagerHarness);
      toolbarHarness = await dataManagerHarness.getToolbar();
    });

    it('should render the data manager with a search-enabled toolbar', async () => {
      const search = await toolbarHarness.getSearch();

      expect(search).not.toBeNull();
    });

    it('should render a primary toolbar item containing the "New" button', async () => {
      const primaryItems = await toolbarHarness.getPrimaryItems();

      expect(primaryItems.length).toBe(1);
      const buttonEl = await primaryItems[0].querySelector('button');
      expect((await buttonEl.text()).trim()).toBe('New');
    });

    it('should render a right toolbar item containing the "Reset data" button', async () => {
      const rightItems = await toolbarHarness.getRightItems();

      expect(rightItems.length).toBe(1);
      const buttonEl = await rightItems[0].querySelector('button');
      expect((await buttonEl.text()).trim()).toBe('Reset data');
    });

    it('should open the new record modal when the "New" toolbar button is clicked', async () => {
      const primaryItem = await toolbarHarness.getPrimaryItem({});
      const buttonEl = await primaryItem.querySelector('button');

      await buttonEl.click();
      fixture.detectChanges();
      await fixture.whenStable();
      modalController.expectOpen(Edit);
    });

    it('should filter the grid rows when search text is entered and restore them when cleared', async () => {
      await loadData();
      const search = await toolbarHarness.getSearch();
      const agGrid = fixture.debugElement.query(By.directive(AgGridAngular))
        .componentInstance as AgGridAngular;

      expect(search).not.toBeNull();
      expect(agGrid.api?.getDisplayedRowCount()).toBe(2);

      await search!.clickOpenSearchButton();
      await search!.enterText('name1');
      fixture.detectChanges();
      await fixture.whenStable();

      expect(await search!.getValue()).toBe('name1');
      expect(agGrid.api?.getDisplayedRowCount()).toBe(1);
      expect(agGrid.api?.getDisplayedRowAtIndex(0)?.data?.name).toBe('name1');

      await search!.clickClearButton();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(await search!.getValue()).toBe('');
      expect(agGrid.api?.getDisplayedRowCount()).toBe(2);
    });
  });

  describe('ag-grid wrapper harness', () => {
    it('should show the ag-grid wrapper when data loads', async () => {
      await loadData();
      const agGridHarness = await harnessLoader.getHarness(SkyAgGridWrapperHarness);

      expect(await agGridHarness.isGridReady()).toBe(true);
    });

    it('should display all expected column IDs in the ag-grid', async () => {
      await loadData();
      const agGridHarness = await harnessLoader.getHarness(SkyAgGridWrapperHarness);
      const columnIds = await agGridHarness.getDisplayedColumnIds();

      expect(columnIds).toEqual(
        jasmine.arrayContaining(['name', 'gender', 'breed', 'birthdate', 'needsAttention']),
      );
    });
  });
});
