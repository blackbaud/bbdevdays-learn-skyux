import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSkyDataGridTesting, SkyDataGridHarness } from '@skyux/data-grid/testing';
import { SkyDataManagerHarness, SkyDataManagerToolbarHarness } from '@skyux/data-manager/testing';
import { SkyFlyoutHarness } from '@skyux/flyout/testing';
import { SkyConfirmType } from '@skyux/modals';
import {
  SkyConfirmTestingController,
  SkyConfirmTestingModule,
  SkyModalTestingController,
  SkyModalTestingModule,
} from '@skyux/modals/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

import { Data } from '../../services/data/data';
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
        provideSkyDataGridTesting(),
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
    const resetSpy = vi.spyOn(TestBed.inject(Data), 'resetData');
    const resetButton = await harnessLoader.getHarness(
      SkyButtonHarness.with({ dataSkyId: 'reset-data-button' }),
    );
    await expect(resetButton.getLabelText()).resolves.toBe('Reset data');
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
      SkyButtonHarness.with({ dataSkyId: 'reset-data-button' }),
    );
    expect(resetButton).toBeTruthy();
    await expect(resetButton.getLabelText()).resolves.toEqual('Reset data');
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
    await expect(flyout.getPrimaryActionButtonLabel()).resolves.toEqual('Edit');
    await expect(flyout.getAriaLabel()).resolves.toEqual('Record for name1');
    await flyout.clickPrimaryActionButton();
    modalController.expectOpen(Edit);
  });

  it('should navigate between records via flyout iterator buttons', async () => {
    await loadData();
    component.onViewClick('id1', 'name1');
    fixture.detectChanges();
    await fixture.whenStable();

    const flyout = await rootHarnessLoader.getHarness(SkyFlyoutHarness);
    await expect(flyout.getAriaLabel()).resolves.toEqual('Record for name1');

    await flyout.clickNextIteratorButton();
    fixture.detectChanges();
    await fixture.whenStable();

    await expect(flyout.getAriaLabel()).resolves.toEqual('Record for name2');

    await flyout.clickPreviousIteratorButton();
    fixture.detectChanges();
    await fixture.whenStable();

    await expect(flyout.getAriaLabel()).resolves.toEqual('Record for name1');
  });

  it('should toggle the needs attention flag', async () => {
    await loadData();
    const getButtonHarnesses = async () =>
      await harnessLoader.getAllHarnesses(
        SkyButtonHarness.with({
          dataSkyId: 'needs-attention-cell',
        }),
      );
    let buttonHarnesses = await getButtonHarnesses();
    expect(buttonHarnesses.length).toBe(2);
    await expect(buttonHarnesses[0].getLabelText()).resolves.toBe('name1 needs attention');
    await buttonHarnesses[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    buttonHarnesses = await getButtonHarnesses();
    await expect(buttonHarnesses[0].getLabelText()).resolves.toBe(
      'Click to mark name1 as needing attention',
    );
  });

  it('should delete a record', async () => {
    const deleteSpy = vi.spyOn(TestBed.inject(Data), 'delete');
    component.onDeleteClick('id1');
    expect(component.rowDeleteIds()).toEqual(['id1']);
    component.rowDeleteConfirm({ id: 'id1' });
    expect(component.rowDeleteIds()).toEqual([]);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
    expect(deleteSpy).toHaveBeenCalledWith('id1');
  });

  it('should be accessible', async () => {
    await loadData();
    const dataGridHarness = await harnessLoader.getHarness(SkyDataGridHarness);
    await expect(dataGridHarness.isGridReady()).resolves.toBe(true);
    const element = fixture.nativeElement as HTMLElement;
    await expect(element).toBeAccessible();
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
      const button = await primaryItems[0].queryHarness(SkyButtonHarness);
      await expect(button.getLabelText()).resolves.toBe('New');
    });

    it('should render a right toolbar item containing the "Reset data" button', async () => {
      const rightItems = await toolbarHarness.getRightItems();

      expect(rightItems.length).toBe(1);
      const button = await rightItems[0].queryHarness(SkyButtonHarness);
      await expect(button.getLabelText()).resolves.toBe('Reset data');
    });

    it('should open the new record modal when the "New" toolbar button is clicked', async () => {
      const primaryItem = await toolbarHarness.getPrimaryItem({});
      const button = await primaryItem.queryHarness(SkyButtonHarness);

      await button.click();
      fixture.detectChanges();
      await fixture.whenStable();
      modalController.expectOpen(Edit);
    });

    it('should filter the grid rows when search text is entered and restore them when cleared', async () => {
      await loadData();
      const search = await toolbarHarness.getSearch();
      const dataGridHarness = await harnessLoader.getHarness(SkyDataGridHarness);

      expect(search).not.toBeNull();
      await expect(dataGridHarness?.getDisplayedRowCount()).resolves.toBe(2);

      if (await search!.isCollapsed()) {
        await search!.clickOpenSearchButton();
      }
      await search!.enterText('name1');
      fixture.detectChanges();
      await fixture.whenStable();

      await expect(search!.getValue()).resolves.toBe('name1');
      await expect(dataGridHarness?.getDisplayedRowCount()).resolves.toBe(1);

      await search!.clickClearButton();
      fixture.detectChanges();
      await fixture.whenStable();

      await expect(search!.getValue()).resolves.toBe('');
      await expect(dataGridHarness?.getDisplayedRowCount()).resolves.toBe(2);

      const nameButtonHarnesses = await harnessLoader.getAllHarnesses(
        SkyButtonHarness.with({
          dataSkyId: 'name-cell',
        }),
      );
      expect(nameButtonHarnesses.length).toBe(2);
      await expect(nameButtonHarnesses[1].getLabelText()).resolves.toBe('name2');
      await nameButtonHarnesses[1].click();
    });
  });

  describe('data-grid harness', () => {
    it('should show the data grid when data loads', async () => {
      await loadData();
      const dataGridHarness = await harnessLoader.getHarness(SkyDataGridHarness);

      await expect(dataGridHarness.isGridReady()).resolves.toBe(true);
    });

    it('should display all expected column IDs in the data grid', async () => {
      await loadData();
      const dataGridHarness = await harnessLoader.getHarness(SkyDataGridHarness);
      const columnIds = await dataGridHarness.getDisplayedColumnIds();

      expect(columnIds).toEqual(
        expect.arrayContaining(['name', 'gender', 'breed', 'birthdate', 'needsAttention']),
      );
    });
  });

  describe('context menu', () => {
    it('should open context menu and display menu items', async () => {
      await loadData();
      const dropdown = await harnessLoader.getHarness(
        SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
      );
      await expect(dropdown.isOpen()).resolves.toBe(false);

      await dropdown.clickDropdownButton();
      fixture.detectChanges();

      const menu = await dropdown.getDropdownMenu();
      const items = await menu.getItems();
      expect(items.length).toBe(4);
    });

    it('should trigger toggleNeedsAttention from context menu', async () => {
      await loadData();
      const attentionSpy = vi.spyOn(TestBed.inject(Data), 'toggleNeedsAttention');
      const dropdown = await harnessLoader.getHarness(
        SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
      );

      await dropdown.clickDropdownButton();
      fixture.detectChanges();

      const menu = await dropdown.getDropdownMenu();
      const item = await menu.getItem({ text: 'Toggle needs-attention' });
      await item.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(attentionSpy).toHaveBeenCalledWith('id1');
    });

    it('should trigger view action from context menu', async () => {
      await loadData();
      const dropdown = await harnessLoader.getHarness(
        SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
      );

      await dropdown.clickDropdownButton();
      fixture.detectChanges();

      const menu = await dropdown.getDropdownMenu();
      const item = await menu.getItem({ text: 'View' });
      await item.click();
      fixture.detectChanges();
      await fixture.whenStable();

      const flyout = await rootHarnessLoader.getHarness(SkyFlyoutHarness);
      expect(flyout).toBeTruthy();
    });

    it('should trigger edit action from context menu', async () => {
      await loadData();
      const dropdown = await harnessLoader.getHarness(
        SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
      );

      await dropdown.clickDropdownButton();
      fixture.detectChanges();

      const menu = await dropdown.getDropdownMenu();
      const item = await menu.getItem({ text: 'Edit' });
      await item.click();
      fixture.detectChanges();
      await fixture.whenStable();

      modalController.expectOpen(Edit);
    });

    it('should trigger delete action from context menu', async () => {
      await loadData();
      const dataGridHarness = await harnessLoader.getHarness(SkyDataGridHarness);
      const dropdowns = await harnessLoader.getAllHarnesses(
        SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
      );
      const clickDelete = async (dropdown: SkyDropdownHarness) => {
        await dropdown.clickDropdownButton();
        const menu = await dropdown.getDropdownMenu();
        const item = await menu.getItem({ text: 'Delete' });
        await item.click();
      };
      await expect(dataGridHarness.getDisplayedRowCount()).resolves.toBe(2);
      expect(dropdowns.length).toBe(2);

      await clickDelete(dropdowns[0]);
      let confirm = await dataGridHarness.getRowInlineDelete('id1');
      await expect(confirm?.isPending()).resolves.toBeFalsy();
      await confirm?.clickCancelButton();
      await expect(dataGridHarness.getDisplayedRowCount()).resolves.toBe(2);

      await clickDelete(dropdowns[0]);
      confirm = await dataGridHarness.getRowInlineDelete('id1');
      expect(confirm, 'shows second delete confirmation').toBeTruthy();
      await confirm?.clickDeleteButton();
      await expect(dataGridHarness.getDisplayedRowCount()).resolves.toBe(1);
    });
  });
});
