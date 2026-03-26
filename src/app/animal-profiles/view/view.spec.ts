import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyAvatarHarness } from '@skyux/avatar/testing';
import { SkyErrorHarness } from '@skyux/errors/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { Data } from '../../services/data/data';

import { View } from './view';
import { MockData } from '../../services/data/mock-data';

describe('View', () => {
  let component: View;
  let fixture: ComponentFixture<View>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [View],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        MockData,
        {
          provide: Data,
          useExisting: MockData,
        },
      ],
    });

    fixture = TestBed.createComponent(View);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show error page when no data is loaded', async () => {
    expect(component).toBeTruthy();
    TestBed.inject(Data).load([
      {
        bio: 'bio',
        birthdate: undefined,
        breed: 'breed',
        gender: 'gender',
        images: [],
        name: 'name',
        needsAttention: false,
        id: 'id',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
    fixture.componentRef.setInput('id', 'id');
    fixture.detectChanges();
    const avatarHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(SkyAvatarHarness);
    expect(await avatarHarness.getInitials()).toBe('N');
    const bioBoxHarness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyBoxHarness.with({ dataSkyId: 'bio' }),
    );
    expect(bioBoxHarness).toBeTruthy();
    expect(await bioBoxHarness.getHeadingText()).toBe('Bio');
  });

  it('should show error page when no data is loaded', async () => {
    expect(component).toBeTruthy();
    const errorHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(SkyErrorHarness);
    expect(await errorHarness.getErrorType()).toBe('notfound');
  });
});
