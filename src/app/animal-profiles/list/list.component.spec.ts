import { provideLocationMocks } from '@angular/common/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { expectAsync } from '@skyux-sdk/testing';
import { of } from 'rxjs';

import { PersistenceService } from '../../services/data/persistence.service';
import { ListComponent } from './list.component';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ListComponent],
      providers: [
        provideLocationMocks(),
        provideRouter([]),
        provideNoopAnimations(),
        {
          provide: PersistenceService,
          useValue: {
            loading: of(false),
          },
        },
      ],
    });
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be accessible', async () => {
    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    const element = fixture.nativeElement as HTMLElement;
    await expectAsync(element).toBeAccessible();
  }, 1e6);
});
