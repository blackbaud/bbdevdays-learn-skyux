import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';

import { HubComponent } from './hub.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { MockStorageService } from '../services/session-storage/mock-storage.service';
import { SESSION_STORAGE } from '../services/session-storage/session-storage.service';
import { DataService } from '../services/data/data.service';
import { SkyActionHubHarness } from '@skyux/pages/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

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
        provideHttpClient(),
        provideHttpClientTesting(),
        MockStorageService,
        {
          provide: SESSION_STORAGE,
          useExisting: MockStorageService,
        },
      ],
    });
    fixture = TestBed.createComponent(HubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyActionHubHarness.with({
        dataSkyId: 'action-hub',
      }),
    );
  });

  it('should create', async () => {
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
    fixture = TestBed.createComponent(HubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  });
});
