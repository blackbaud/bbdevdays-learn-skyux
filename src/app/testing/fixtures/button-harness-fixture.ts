import { Component } from '@angular/core';

@Component({
  selector: 'app-button-harness-fixture',
  template: `
    <button type="button">Button 1</button>
    <button type="button">Button 2</button>
    <button type="button">Button 3</button>
    <button type="button">Button 4</button>
    <button type="button">Button 5</button>
    <button type="button">Button 6</button>
    <button type="button" disabled>Disabled Button</button>
  `,
})
export class ButtonHarnessFixture {}
