import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPageComponent } from './view-page.component';
import {
  MOCK_PLATFORM_LOCATION_CONFIG,
  MockPlatformLocationConfig,
  provideLocationMocks,
} from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { MockStorageService } from '../../services/session-storage/mock-storage.service';
import { SESSION_STORAGE } from '../../services/session-storage/session-storage.service';
import { EditService } from '../edit/edit.service';
import { By } from '@angular/platform-browser';

describe('ViewPageComponent', () => {
  let component: ViewPageComponent;
  let fixture: ComponentFixture<ViewPageComponent>;
  let editService: { edit: jasmine.Spy };

  beforeEach(() => {
    editService = {
      edit: jasmine.createSpy('edit'),
    };
    TestBed.configureTestingModule({
      imports: [ViewPageComponent],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        {
          provide: MOCK_PLATFORM_LOCATION_CONFIG,
          useValue: {
            startUrl: '/animal-profiles/view/1',
          } as MockPlatformLocationConfig,
        },
        {
          provide: EditService,
          useValue: editService,
        },
        MockStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockStorageService,
        },
      ],
    });

    fixture = TestBed.createComponent(ViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
    (
      fixture.debugElement.query(By.css('[data-button-id="edit"]'))
        .nativeElement as HTMLButtonElement
    ).click();
    expect(editService.edit).toHaveBeenCalled();
  });
});
