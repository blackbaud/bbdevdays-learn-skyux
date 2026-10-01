import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SkyAlertHarness } from '@skyux/indicators/testing';
import { SkyActionButtonContainerHarness, SkyActionButtonHarness } from '@skyux/layout/testing';

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

  it('should create', async () => {
    expect(component).toBeTruthy();
    const harness = await TestbedHarnessEnvironment.loader(fixture).getHarness(
      SkyActionButtonHarness.with({
        dataSkyId: 'action-button-get-started-with-skyux',
      }),
    );
    expect(await harness.getHeaderText()).toEqual('Get Started with SKY UX');
  });

  it('should show a warning alert with training content message', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const alert = await loader.getHarness(SkyAlertHarness);

    expect(await alert.getAlertType()).toEqual('warning');
    expect(await alert.getText()).toContain('Training content is currently under development.');
  });

  it('should render four action buttons', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const container = await loader.getHarness(SkyActionButtonContainerHarness);
    const buttons = await container.getActionButtons({});

    expect(buttons.length).toEqual(4);
  });

  it('should render "Join Blackbaud SKY Developer Community" action button with correct details', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const container = await loader.getHarness(SkyActionButtonContainerHarness);
    const button = await container.getActionButton({
      header: 'Join Blackbaud SKY Developer Community',
    });

    expect(await button.getDetailsText()).toContain(
      'Find the tools and partners to integrate with Blackbaud',
    );
  });

  it('should render "Learn More about SKY UX" action button with correct details', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const container = await loader.getHarness(SkyActionButtonContainerHarness);
    const button = await container.getActionButton({ header: 'Learn More about SKY UX' });

    expect(await button.getDetailsText()).toContain(
      'The documentation site includes design principles and code examples.',
    );
  });

  it('should render "Learn Angular" action button with correct details', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const container = await loader.getHarness(SkyActionButtonContainerHarness);
    const button = await container.getActionButton({ header: 'Learn Angular' });

    expect(await button.getDetailsText()).toContain(
      'Angular provides a browser-based learning environment.',
    );
  });

  it('should render "Get Started with SKY UX" action button with correct details', async () => {
    const loader = TestbedHarnessEnvironment.loader(fixture);
    const button = await loader.getHarness(
      SkyActionButtonHarness.with({
        dataSkyId: 'action-button-get-started-with-skyux',
      }),
    );

    expect(await button.getDetailsText()).toContain(
      'Explore the design principles and developer tools for working with SKY UX.',
    );
  });
});
