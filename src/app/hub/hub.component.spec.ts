import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyActionHubHarness } from '@skyux/pages/testing';

import { DataService } from '../services/data/data.service';
import { MockPersistenceService } from '../services/data/mock-persistence.service';
import { PersistenceService } from '../services/data/persistence.service';

import { HubComponent } from './hub.component';

describe('HubComponent', () => {
  let component: HubComponent;
  let fixture: ComponentFixture<HubComponent>;
  let harness: SkyActionHubHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [HubComponent],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        MockPersistenceService,
        {
          provide: PersistenceService,
          useExisting: MockPersistenceService,
        },
      ],
    });
    fixture = TestBed.createComponent(HubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyActionHubHarness.with({
        dataSkyId: 'action-hub',
      }),
    );
  });

  it('should show a count of animals needing attention', async () => {
    expect(component).toBeTruthy();
    const dataService = TestBed.inject(DataService);
    dataService.load([]);
    fixture.detectChanges();
    await fixture.whenStable();
    const items = await harness.getNeedsAttentionItems();
    expect(items).toHaveSize(1);
    expect(await items[0].getText()).toEqual('0 animals need attention');
    dataService.load([
      {
        bio: 'bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        breed: 'breed',
        gender: '',
        images: [],
        name: 'name1',
        id: 'id1',
        needsAttention: true,
      },
      {
        bio: 'bio',
        createdAt: new Date(),
        updatedAt: new Date(),
        breed: 'breed',
        gender: '',
        images: [],
        name: 'name2',
        id: 'id2',
        needsAttention: false,
      },
    ]);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(await (await harness.getNeedsAttentionItems())[0].getText()).toEqual(
      '1 animal needs attention',
    );
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  });
});
