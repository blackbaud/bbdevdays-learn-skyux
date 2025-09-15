import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonHarness } from './button-harness';
import { ButtonHarnessFixtureComponent } from './fixtures/button-harness-fixture.component';

describe('ButtonHarness', () => {
  let fixture: ComponentFixture<ButtonHarnessFixtureComponent>;
  let loader: HarnessLoader;

  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonHarnessFixtureComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
  });

  it('should get button harnesses', async () => {
    const buttonHarnesses = await loader.getAllHarnesses(ButtonHarness.with());
    expect(buttonHarnesses.length).toBe(7);
    expect(await buttonHarnesses[0].getText()).toBe('Button 1');
    expect(await buttonHarnesses[6].getText()).toBe('Disabled Button');
  });

  it('should get button harnesses with text filter', async () => {
    const buttonHarnesses = await loader.getAllHarnesses(
      ButtonHarness.with({ text: 'Button 1' }),
    );
    expect(buttonHarnesses.length).toBe(1);
    await buttonHarnesses[0].focus();
    expect(await buttonHarnesses[0].isFocused()).toBeTrue();
    await buttonHarnesses[0].blur();
    expect(await buttonHarnesses[0].isFocused()).toBeFalse();
  });
});
