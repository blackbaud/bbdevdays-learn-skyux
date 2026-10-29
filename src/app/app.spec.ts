import { TestBed } from '@angular/core/testing';

import { App } from './app';
import { provideSkyMediaQueryTesting } from '@skyux/core/testing';

describe('App', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [App],
      providers: [provideSkyMediaQueryTesting()],
    }),
  );

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
