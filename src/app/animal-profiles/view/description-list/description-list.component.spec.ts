import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DescriptionListComponent } from './description-list.component';
import { Component } from '@angular/core';
import { DescriptionListItemComponent } from './description-list-item.component';

@Component({
  selector: 'app-test-list',
  standalone: true,
  template: `
    <app-description-list>
      <app-description-list-item term="term1" description="description1" />
      <app-description-list-item term="term2" description="description2" />
    </app-description-list>
  `,
  imports: [DescriptionListComponent, DescriptionListItemComponent],
})
class TestListComponent {}

describe('DescriptionListComponent', () => {
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
