import { Component, inject, model } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { AnimalProfileRow } from '../../../types/animal-profile-row';
import List from '../list';

@Component({
  selector: 'app-context-menu',
  imports: [SkyDropdownModule, SkyIconModule],
  templateUrl: './context-menu.html',
})
export class ContextMenu implements ICellRendererAngularComp {
  protected readonly list = inject(List);
  public readonly params = model<ICellRendererParams<AnimalProfileRow>>();

  public agInit(params: ICellRendererParams<AnimalProfileRow>): void {
    this.params.set(params);
  }

  public refresh(params: ICellRendererParams<AnimalProfileRow>): boolean {
    this.agInit(params);
    return false;
  }
}
