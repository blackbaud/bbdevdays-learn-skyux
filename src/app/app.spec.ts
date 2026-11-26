import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';

import { App, showGithubLink } from './app';

describe('App', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideSkyMediaQueryTesting(), provideRouter([])],
    }),
  );

  it('should create the app', async () => {
    TestBed.overrideProvider(showGithubLink, { useValue: signal(true) });
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(!!fixture.nativeElement.querySelector('.gh')).toBeTruthy();
  });

  it('should hide the github link', async () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(!!fixture.nativeElement.querySelector('.gh')).toBeFalsy();
  });
});
