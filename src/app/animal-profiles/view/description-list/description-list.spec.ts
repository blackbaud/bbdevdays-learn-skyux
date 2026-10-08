import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyDescriptionListHarness } from '@skyux/layout/testing';

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

@Component({
  selector: 'app-test-list-horizontal',
  template: `
    <app-description-list mode="horizontal">
      <app-description-list-item term="term1" description="description1" />
    </app-description-list>
  `,
  imports: [DescriptionList, DescriptionListItem],
})
class TestListHorizontalComponent {}

describe('DescriptionList', () => {
  let component: TestListComponent;
  let fixture: ComponentFixture<TestListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestListComponent, TestListHorizontalComponent],
    });

    fixture = TestBed.createComponent(TestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render description list items with correct terms and descriptions', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const listHarness = await loader.getHarness(SkyDescriptionListHarness);
    const items = await listHarness.getContent();

    expect(items.length).toBe(2);
    expect(await items[0].getTermText()).toBe('term1');
    expect(await items[0].getDescriptionText()).toBe('description1');
    expect(await items[1].getTermText()).toBe('term2');
    expect(await items[1].getDescriptionText()).toBe('description2');
  });

  it('should use vertical mode by default', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const listHarness = await loader.getHarness(SkyDescriptionListHarness);

    expect(await listHarness.getMode()).toBe('vertical');
  });

  it('should support horizontal mode', async () => {
    const horizontalFixture = TestBed.createComponent(TestListHorizontalComponent);
    horizontalFixture.detectChanges();
    const loader = TestbedHarnessEnvironment.loader(horizontalFixture);
    const listHarness = await loader.getHarness(SkyDescriptionListHarness);

    expect(await listHarness.getMode()).toBe('horizontal');
  });
});
