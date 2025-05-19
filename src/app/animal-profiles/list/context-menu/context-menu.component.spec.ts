import { ContextMenuComponent } from './context-menu.component';
import { TestBed } from '@angular/core/testing';
import { ICellRendererParams } from 'ag-grid-community';
import ListComponent from '../list.component';

describe('ContextMenuComponent', () => {
  it('should refresh', () => {
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
    const fixture = TestBed.createComponent(ContextMenuComponent);
    const component = fixture.componentInstance;
    fixture.detectChanges();
    expect(component).toBeTruthy();
    const initSpy = spyOn(component, 'agInit');
    component.refresh({} as ICellRendererParams);
    expect(initSpy).toHaveBeenCalledWith({} as ICellRendererParams);
  });
});
