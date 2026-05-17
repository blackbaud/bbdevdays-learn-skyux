import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { SkyBoxHarness } from '@skyux/layout/testing';
import { SkyActionHubHarness } from '@skyux/pages/testing';

import { Hub } from './hub';
import { MockData } from '../services/data/fixtures/mock-data';
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
    expect(items.length).toEqual(1);
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

  it('should display the hub title', async () => {
    expect(await harness.getTitle()).toEqual('Bark Back');
  });

  it('should display related links from welcomeToSkyuxLinks', async () => {
    const relatedLinks = await harness.getRelatedLinks();
    const items = await relatedLinks.getListItems();
    const labels = await Promise.all(items.map((item) => item.getText()));

    expect(items.length).toBeGreaterThan(0);
    expect(labels).toContain('SKY UX Documentation');
    expect(labels).toContain('Learn Angular');
    expect(labels).toContain('Get Started with SKY UX');
  });

  it('should display all five related links', async () => {
    const relatedLinks = await harness.getRelatedLinks();
    const items = await relatedLinks.getListItems();

    expect(items.length).toEqual(5);
  });

  it('should display the welcome box with correct heading', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const box = await loader.getHarness(SkyBoxHarness.with({ dataSkyId: 'welcome-box' }));

    expect(await box.getHeadingText()).toEqual('Welcome to SKY UX');
  });

  it('should be accessible', async () => {
    await fixture.whenStable();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  });
});
