import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPageComponent } from './view-page.component';
import {
  MOCK_PLATFORM_LOCATION_CONFIG,
  MockPlatformLocationConfig,
  provideLocationMocks,
} from '@angular/common/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { DataService } from '../../services/data/data.service';
import { AnimalProfile } from '../../types/animal-profile';

describe('ViewPageComponent', () => {
  let component: ViewPageComponent;
  let fixture: ComponentFixture<ViewPageComponent>;
  let dataService: DataService;

  beforeEach(() => {
    dataService = {
      list: of<AnimalProfile[]>([]),
    } as DataService;
    TestBed.configureTestingModule({
      imports: [ViewPageComponent],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        {
          provide: MOCK_PLATFORM_LOCATION_CONFIG,
          useValue: {
            startUrl: '/animal-profiles/view/1',
          } as MockPlatformLocationConfig,
        },
        {
          provide: DataService,
          useValue: dataService,
        },
      ],
    });

    fixture = TestBed.createComponent(ViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    await fixture.whenStable();
    expect(component).toBeTruthy();
  });
});
