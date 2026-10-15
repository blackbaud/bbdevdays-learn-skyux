import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownHarness, SkyDropdownMenuHarness } from '@skyux/popovers/testing';

import { ICellRendererParams } from 'ag-grid-community';

import List from '../list';

import { ContextMenu } from './context-menu';

describe('ContextMenu', () => {
  let fixture: ComponentFixture<ContextMenu>;
  let component: ContextMenu;
  let harnessLoader: HarnessLoader;
  let mockList: jasmine.SpyObj<List>;

  beforeEach(() => {
    mockList = jasmine.createSpyObj([
      'onViewClick',
      'onEditClick',
      'onDeleteClick',
      'toggleNeedsAttention',
    ]);
    TestBed.configureTestingModule({
      imports: [ContextMenu],
      providers: [
        {
          provide: List,
          useValue: mockList,
        },
      ],
    });
    fixture = TestBed.createComponent(ContextMenu);
    fixture.componentInstance.agInit({
      data: {
        id: 'id1',
        name: 'name1',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    component = fixture.componentInstance;
    fixture.detectChanges();
    harnessLoader = TestbedHarnessEnvironment.loader(fixture);
  });

  async function openMenu(): Promise<{
    dropdown: SkyDropdownHarness;
    menu: SkyDropdownMenuHarness;
  }> {
    const dropdown = await harnessLoader.getHarness(
      SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
    );
    await dropdown.clickDropdownButton();
    const menu = await dropdown.getDropdownMenu();

    return { dropdown, menu };
  }

  async function clickMenuItem(text: string): Promise<void> {
    const { menu } = await openMenu();
    const items = await menu.getItems();
    const matchingItem = await Promise.all(
      items.map(async (item) => ({
        item,
        text: await item.getText(),
      })),
    );
    const menuItem = matchingItem.find((entry) => entry.text === text)?.item;

    expect(menuItem).toBeDefined();
    if (!menuItem) {
      return;
    }

    await menuItem.click();
  }

  it('should open a context menu', async () => {
    const dropdownHarness = await harnessLoader.getHarness(
      SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
    );
    expect(dropdownHarness).toBeTruthy();
    expect(await dropdownHarness.isOpen()).toBe(false);
    await dropdownHarness.clickDropdownButton();
    const menu = await dropdownHarness.getDropdownMenu();
    expect(menu).toBeTruthy();
    expect(await dropdownHarness.isOpen()).toBe(true);
    expect(
      await Promise.all(await menu.getItems().then((items) => items.map((item) => item.getText()))),
    ).toEqual(['Toggle needs-attention', 'View', 'Edit', 'Delete']);
  });

  it('should call toggleNeedsAttention when "Toggle needs-attention" item is clicked', async () => {
    await clickMenuItem('Toggle needs-attention');

    expect(mockList.toggleNeedsAttention).toHaveBeenCalledWith(
      jasmine.objectContaining({ id: 'id1' }),
    );
  });

  it('should call onViewClick when "View" item is clicked', async () => {
    await clickMenuItem('View');

    expect(mockList.onViewClick).toHaveBeenCalledWith('id1', 'name1');
  });

  it('should call onEditClick when "Edit" item is clicked', async () => {
    await clickMenuItem('Edit');

    expect(mockList.onEditClick).toHaveBeenCalledWith('id1');
  });

  it('should call onDeleteClick when "Delete" item is clicked', async () => {
    await clickMenuItem('Delete');

    expect(mockList.onDeleteClick).toHaveBeenCalledWith('id1');
  });

  it('should refresh with agInit', () => {
    expect(component).toBeTruthy();
    const initSpy = spyOn(component, 'agInit').and.callThrough();
    component.refresh({} as ICellRendererParams);
    expect(initSpy).toHaveBeenCalledWith({} as ICellRendererParams);
  });
});
