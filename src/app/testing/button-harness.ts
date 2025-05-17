import { ElementHarness } from './element-harness';

export class ButtonHarness extends ElementHarness {
  public static override hostSelector = `button, input[type="button"], input[type="submit"]`;
}
