import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListItem } from './description-list-item';
import { DescriptionList } from './description-list';

@Component({
  selector: 'app-test-list',
  template: `
    <app-description-list>
      <app-description-list-item term="term1" description="description1" />
      <app-description-list-item term="term2" description="description2" />
    </app-description-list>
  `,
  imports: [DescriptionList, DescriptionListItem],
})
class TestListComponent {}

describe('DescriptionList', () => {
  let component: TestListComponent;
  let fixture: ComponentFixture<TestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestListComponent],
    });

    fixture = TestBed.createComponent(TestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
