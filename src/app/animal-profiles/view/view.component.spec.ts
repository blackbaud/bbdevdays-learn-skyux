import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewComponent } from './view.component';
import { MockStorageService } from '../../services/session-storage/mock-storage.service';
import { SESSION_STORAGE } from '../../services/session-storage/session-storage.service';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewComponent],
      providers: [
        MockStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockStorageService,
        },
      ],
    });

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
