import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { ICellRendererParams } from 'ag-grid-community';

import List from '../list';

import { ContextMenu } from './context-menu';

describe('ContextMenu', () => {
  let fixture: ComponentFixture<ContextMenu>;
  let component: ContextMenu;

  beforeEach(() => {
    const mockList = jasmine.createSpyObj(['onViewClick', 'onEditClick', 'onDeleteClick']);
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
  });

  it('should open a context menu', async () => {
    const dropdownHarness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyDropdownHarness.with({ dataSkyId: 'context-menu' }),
    );
    expect(dropdownHarness).toBeTruthy();
    expect(await dropdownHarness.isOpen()).toBeFalse();
    await dropdownHarness.clickDropdownButton();
    const menu = await dropdownHarness.getDropdownMenu();
    expect(menu).toBeTruthy();
    expect(await dropdownHarness.isOpen()).toBeTrue();
    expect(
      await Promise.all(await menu.getItems().then((items) => items.map((item) => item.getText()))),
    ).toEqual(['Toggle needs-attention', 'View', 'Edit', 'Delete']);
  });

  it('should refresh with agInit', () => {
    expect(component).toBeTruthy();
    const initSpy = spyOn(component, 'agInit').and.callThrough();
    component.refresh({} as ICellRendererParams);
    expect(initSpy).toHaveBeenCalledWith({} as ICellRendererParams);
  });
});
