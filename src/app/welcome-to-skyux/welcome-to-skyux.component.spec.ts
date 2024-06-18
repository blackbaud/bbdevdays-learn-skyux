import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { WelcomeToSkyuxComponent } from './welcome-to-skyux.component';

describe('WelcomeToSkyuxComponent', () => {
  let component: WelcomeToSkyuxComponent;
  let fixture: ComponentFixture<WelcomeToSkyuxComponent>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [WelcomeToSkyuxComponent],
    });

    fixture = TestBed.createComponent(WelcomeToSkyuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll(
          'sky-action-button-header',
        ),
      ).pop()?.textContent,
    ).toEqual('Get Started with SKY UX');
  });
});
