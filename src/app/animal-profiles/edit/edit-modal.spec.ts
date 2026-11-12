import { TestBed } from '@angular/core/testing';
import { SkyModalTestingController, SkyModalTestingModule } from '@skyux/modals/testing';

import { Edit } from './edit';
import { EditModal } from './edit-modal';

describe('EditModal', () => {
  let service: EditModal;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [SkyModalTestingModule] });
    service = TestBed.inject(EditModal);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    service.edit();
    const controller = TestBed.inject(SkyModalTestingController);
    expect(() => {
      controller.expectOpen(Edit);
    }).not.toThrow();
    controller.closeTopModal();
    expect(() => {
      controller.expectNone();
    }).not.toThrow();
    service.edit('id');
    expect(() => {
      controller.expectOpen(Edit);
    }).not.toThrow();
  });
});
