import {
  ComponentHarnessConstructor,
  ContentContainerComponentHarness,
  HarnessPredicate,
} from '@angular/cdk/testing';

import { ElementHarnessFilters } from './element-harness-filters';

export class ElementHarness extends ContentContainerComponentHarness {
  public static hostSelector = `*`;

  public static with<T extends ElementHarness>(
    this: ComponentHarnessConstructor<T>,
    options: ElementHarnessFilters = {},
  ): HarnessPredicate<T> {
    return new HarnessPredicate(this, options).addOption('text', options.text, (harness, text) =>
      HarnessPredicate.stringMatches(harness.getText(), text),
    );
  }

  public async getText(): Promise<string> {
    return (await this.host()).text().then((text) => text.trim());
  }

  public async focus(): Promise<void> {
    return (await this.host()).focus();
  }

  public async blur(): Promise<void> {
    return (await this.host()).blur();
  }

  public async isFocused(): Promise<boolean> {
    return (await this.host()).isFocused();
  }
}
