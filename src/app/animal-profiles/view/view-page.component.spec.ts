import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import {
  MOCK_PLATFORM_LOCATION_CONFIG,
  provideLocationMocks,
} from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { MockPersistenceService } from '../../services/data/mock-persistence.service';
import { PersistenceService } from '../../services/data/persistence.service';
import { ButtonHarness } from '../../testing/button-harness';
import { EditService } from '../edit/edit.service';

import { ViewPageComponent } from './view-page.component';

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
          useValue: { startUrl: '/animal-profiles/view/1' },
        },
        {
          provide: EditService,
          useValue: editService,
        },
        MockPersistenceService,
        {
          provide: PersistenceService,
          useExisting: MockPersistenceService,
        },
      ],
    });

    fixture = TestBed.createComponent(ViewPageComponent);
    component = fixture.componentInstance;
  });

  it('should load the record view', async () => {
    fixture.componentRef.setInput('id', 'test-id');
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const button =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(ButtonHarness);
    expect(button).toBeTruthy();
    expect(await button.getText()).toBe('Edit');
    await button.click();
    expect(editService.edit).toHaveBeenCalledWith('test-id');
  });
});
