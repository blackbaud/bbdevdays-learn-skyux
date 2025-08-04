import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDropdownHarness } from '@skyux/popovers/testing';

import { ICellRendererParams } from 'ag-grid-community';

import ListComponent from '../list.component';

import { ContextMenuComponent } from './context-menu.component';

describe('ContextMenuComponent', () => {
  let fixture: ComponentFixture<ContextMenuComponent>;
  let component: ContextMenuComponent;

  beforeEach(() => {
    const mockList = jasmine.createSpyObj([
      'onViewClick',
      'onEditClick',
      'onDeleteClick',
    ]);
    TestBed.configureTestingModule({
      imports: [ContextMenuComponent],
      providers: [
        {
          provide: ListComponent,
          useValue: mockList,
        },
      ],
    });
    fixture = TestBed.createComponent(ContextMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should open a context menu', async () => {
    const dropdownHarness = await TestbedHarnessEnvironment.loader(
      fixture,
    ).getHarness(SkyDropdownHarness.with({ dataSkyId: 'context-menu' }));
    expect(dropdownHarness).toBeTruthy();
    expect(await dropdownHarness.isOpen()).toBeFalse();
    await dropdownHarness.clickDropdownButton();
    const menu = await dropdownHarness.getDropdownMenu();
    expect(menu).toBeTruthy();
    expect(await dropdownHarness.isOpen()).toBeTrue();
    expect(
      await Promise.all(
        await menu
          .getItems()
          .then((items) => items.map((item) => item.getText())),
      ),
    ).toEqual(['View', 'Edit', 'Delete']);
  });

  it('should refresh with agInit', () => {
    expect(component).toBeTruthy();
    const initSpy = spyOn(component, 'agInit').and.callThrough();
    component.refresh({} as ICellRendererParams);
    expect(initSpy).toHaveBeenCalledWith({} as ICellRendererParams);
  });
});
