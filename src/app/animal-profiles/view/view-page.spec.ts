import type { Mock } from 'vitest';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MOCK_PLATFORM_LOCATION_CONFIG, provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyWaitHarness } from '@skyux/indicators/testing';
import { SkyButtonHarness } from '@skyux/forms/testing';

import { EditModal } from '../edit/edit-modal';

import { ViewPage } from './view-page';
import { MockData } from '../../services/data/fixtures/mock-data';
import { Data } from '../../services/data/data';

describe('ViewPage', () => {
  let component: ViewPage;
  let fixture: ComponentFixture<ViewPage>;
  let editModal: {
    edit: Mock;
  };

  beforeEach(() => {
    editModal = {
      edit: vi.fn(),
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
          provide: EditModal,
          useValue: editModal,
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
    const button = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyButtonHarness.with({ dataSkyId: 'edit-button' }),
    );
    expect(button).toBeTruthy();
    await expect(button.getLabelText()).resolves.toBe('Edit');
    await button.click();
    expect(editModal.edit).toHaveBeenCalledWith('test-id');
  });

  it('should show a full-page wait indicator while data is loading', async () => {
    const data = TestBed.inject(MockData);
    data.loading.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const loader = TestbedHarnessEnvironment.loader(fixture);
    const waitHarness = await loader.getHarness(SkyWaitHarness);

    await expect(waitHarness.isFullPage()).resolves.toBe(true);
  });
});
