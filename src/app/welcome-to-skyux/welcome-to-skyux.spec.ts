import { ComponentFixture, TestBed } from '@angular/core/testing';
import { expect } from '@skyux-sdk/testing';

import { WelcomeToSkyux } from './welcome-to-skyux';

describe('WelcomeToSkyux', () => {
  let component: WelcomeToSkyux;
  let fixture: ComponentFixture<WelcomeToSkyux>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WelcomeToSkyux],
    });

    fixture = TestBed.createComponent(WelcomeToSkyux);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(
      Array.from(
        (fixture.nativeElement as HTMLElement).querySelectorAll('sky-action-button-header'),
      ).pop()?.textContent,
    ).toEqual('Get Started with SKY UX');
  });
});
