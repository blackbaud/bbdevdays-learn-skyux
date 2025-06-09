import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';

import { SESSION_STORAGE } from './session-storage';

describe('Session storage', () => {
  it('should be defined', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {
            defaultView: {
              sessionStorage: {},
            },
          },
        },
      ],
    });
    expect(TestBed.inject(SESSION_STORAGE)).toBeDefined();
  });

  it('should be undefined', () => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: DOCUMENT,
          useValue: {
            defaultView: undefined,
          },
        },
      ],
    });
    expect(TestBed.inject(SESSION_STORAGE)).toBeUndefined();
  });
});
