import { Component, inject } from '@angular/core';
import { SkyIconModule } from '@skyux/icon';
import { SkyDropdownModule } from '@skyux/popovers';

import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

import { AnimalProfileRow } from '../../../types/animal-profile-row';
import ListComponent from '../list.component';

@Component({
  selector: 'app-context-menu',
  imports: [SkyDropdownModule, SkyIconModule],
  templateUrl: './context-menu.component.html',
})
export class ContextMenuComponent implements ICellRendererAngularComp {
  protected readonly list = inject(ListComponent);
  protected params: ICellRendererParams<AnimalProfileRow> | undefined;

  public agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  public refresh(params: ICellRendererParams<AnimalProfileRow>): boolean {
    this.agInit(params);
    return false;
  }
}
