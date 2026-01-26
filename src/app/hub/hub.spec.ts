import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyActionHubHarness } from '@skyux/pages/testing';

import { Hub } from './hub';
import { MockData } from '../services/data/mock-data';
import { Data } from '../services/data/data';

describe('Hub', () => {
  let component: Hub;
  let fixture: ComponentFixture<Hub>;
  let harness: SkyActionHubHarness;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [Hub],
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
    fixture = TestBed.createComponent(Hub);
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
    const dataService = TestBed.inject(Data);
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
