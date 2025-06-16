import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAvatarHarness } from '@skyux/avatar/testing';
import { SkyErrorHarness } from '@skyux/errors/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';

import { DataService } from '../../services/data/data.service';
import { MockPersistenceService } from '../../services/data/mock-persistence.service';
import { PersistenceService } from '../../services/data/persistence.service';

import { ViewComponent } from './view.component';

describe('ViewComponent', () => {
  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewComponent],
      providers: [
        MockPersistenceService,
        {
          provide: PersistenceService,
          useExisting: MockPersistenceService,
        },
      ],
    });

    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show error page when no data is loaded', async () => {
    expect(component).toBeTruthy();
    TestBed.inject(DataService).load([
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
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyAvatarHarness,
      );
    expect(await avatarHarness.getInitials()).toBe('N');
    const bioBoxHarness = await TestbedHarnessEnvironment.loader(
      fixture,
    ).getHarness(SkyBoxHarness.with({ dataSkyId: 'bio' }));
    expect(bioBoxHarness).toBeTruthy();
    expect(await bioBoxHarness.getHeadingText()).toBe('Bio');
  });

  it('should show error page when no data is loaded', async () => {
    expect(component).toBeTruthy();
    const errorHarness =
      await TestbedHarnessEnvironment.loader(fixture).getHarness(
        SkyErrorHarness,
      );
    expect(await errorHarness.getErrorType()).toBe('notfound');
  });
});
