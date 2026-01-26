import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MOCK_PLATFORM_LOCATION_CONFIG, provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { ButtonHarness } from '../../testing/button-harness';
import { EditService } from '../edit/edit.service';

import { ViewPage } from './view-page';
import { MockData } from '../../services/data/mock-data';
import { Data } from '../../services/data/data';

describe('ViewPage', () => {
  let component: ViewPage;
  let fixture: ComponentFixture<ViewPage>;
  let editService: { edit: jasmine.Spy };

  beforeEach(() => {
    editService = {
      edit: jasmine.createSpy('edit'),
    };
    TestBed.configureTestingModule({
      imports: [ViewPage],
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
        MockData,
        {
          provide: Data,
          useExisting: MockData,
        },
      ],
    });

    fixture = TestBed.createComponent(ViewPage);
    component = fixture.componentInstance;
  });

  it('should load the record view', async () => {
    const data = TestBed.inject(MockData);
    data.loading.set(false);
    data.load([
      {
        id: 'test-id',
        name: 'test-name',
        breed: 'test-breed',
        gender: 'test-gender',
        birthdate: new Date(),
        bio: 'test-bio',
        images: [],
        needsAttention: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    fixture.componentRef.setInput('id', 'test-id');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const button = await TestbedHarnessEnvironment.loader(fixture).getHarness(ButtonHarness);
    expect(button).toBeTruthy();
    expect(await button.getText()).toBe('Edit');
    await button.click();
    expect(editService.edit).toHaveBeenCalledWith('test-id');
  });
});
