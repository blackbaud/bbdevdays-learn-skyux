import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SkyAvatarHarness } from '@skyux/avatar/testing';
import { SkyErrorHarness } from '@skyux/errors/testing';
import { SkyAlertHarness } from '@skyux/indicators/testing';
import { SkyBoxHarness, SkyDescriptionListHarness } from '@skyux/layout/testing';
import { SkyPageHeaderHarness } from '@skyux/pages/testing';

import { Data } from '../../services/data/data';
import { AnimalProfile } from '../../types/animal-profile';

import { View } from './view';
import { MockData } from '../../services/data/fixtures/mock-data';

function createProfile(overrides: Partial<AnimalProfile> = {}): AnimalProfile {
  return {
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
    ...overrides,
  };
}

describe('View', () => {
  let component: View;
  let fixture: ComponentFixture<View>;

  async function loadRecord(record: AnimalProfile, id = record.id): Promise<void> {
    TestBed.inject(Data).load([record]);
    fixture.componentRef.setInput('id', id);
    fixture.detectChanges();
    await fixture.whenStable();
  }

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

  it('should render animal profile when data is loaded', async () => {
    expect(component).toBeTruthy();
    await loadRecord(createProfile());
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

  it('should show the page title as the animal name', async () => {
    await loadRecord(
      createProfile({
        bio: '',
        breed: 'Labrador',
        gender: 'Male',
        name: 'Buddy',
        id: 'buddy-id',
      }),
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const pageHeader = await loader.getHarness(SkyPageHeaderHarness);

    expect(await pageHeader.getPageTitle()).toBe('Buddy');
  });

  it('should show a warning alert when the animal needs attention', async () => {
    await loadRecord(
      createProfile({
        bio: '',
        breed: 'Poodle',
        gender: 'Female',
        name: 'Fifi',
        needsAttention: true,
        id: 'fifi-id',
      }),
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const alertHarness = await loader.getHarness(SkyAlertHarness);

    expect(await alertHarness.getAlertType()).toBe('warning');
    expect(await alertHarness.getText()).toContain('needs attention');
  });

  it('should not show a warning alert when the animal does not need attention', async () => {
    await loadRecord(
      createProfile({
        bio: '',
        breed: 'Beagle',
        gender: 'Male',
        name: 'Charlie',
        id: 'charlie-id',
      }),
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const alerts = await loader.getAllHarnesses(SkyAlertHarness);

    expect(alerts.length).toBe(0);
  });

  it('should show description list with breed and gender', async () => {
    await loadRecord(
      createProfile({
        bio: '',
        breed: 'Corgi',
        gender: 'Female',
        name: 'Lola',
        id: 'lola-id',
      }),
    );
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const lists = await loader.getAllHarnesses(SkyDescriptionListHarness);
    const listContents = await Promise.all(lists.map((list) => list.getContent()));
    const listWithBreedAndGender = await Promise.all(
      listContents.map(async (items) => ({
        items,
        terms: await Promise.all(items.map((item) => item.getTermText())),
      })),
    );
    const matchingList = listWithBreedAndGender.find(
      ({ terms }) => terms.includes('Breed') && terms.includes('Gender'),
    );

    expect(matchingList).toBeDefined();
    if (!matchingList) {
      return;
    }

    const breedItem = matchingList.items[matchingList.terms.indexOf('Breed')];
    const genderItem = matchingList.items[matchingList.terms.indexOf('Gender')];

    expect(await breedItem.getDescriptionText()).toBe('Corgi');
    expect(await genderItem.getDescriptionText()).toBe('Female');
  });
});
