import { TemplateRef } from '@angular/core';
import { SkyCellType } from '@skyux/ag-grid';
import { SkyDataManagerState } from '@skyux/data-manager';

import { ColDef } from 'ag-grid-community';

import { AnimalProfileRow } from '../../types/animal-profile-row';
import { ContextMenu } from './context-menu/context-menu';

export interface ColumnTemplates {
  avatarTemplate: TemplateRef<unknown> | undefined;
  starTemplate: TemplateRef<unknown> | undefined;
  linkTemplate: TemplateRef<unknown> | undefined;
}

export function buildColumnDefs(templates: ColumnTemplates): ColDef<AnimalProfileRow>[] {
  return [
    {
      field: 'menu',
      type: SkyCellType.Template,
      headerComponentParams: {
        headerHidden: true,
      },
      cellRenderer: ContextMenu,
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      field: 'image',
      type: SkyCellType.Template,
      headerComponentParams: {
        headerHidden: true,
      },
      cellRendererParams: {
        template: templates.avatarTemplate,
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      headerName: 'Needs attention?',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: templates.starTemplate,
      },
      field: 'needsAttention',
      headerComponentParams: {
        headerHidden: true,
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
    },
    {
      field: 'name',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: templates.linkTemplate,
      },
      initialSort: 'asc',
    },
    {
      field: 'gender',
    },
    {
      field: 'breed',
    },
    {
      field: 'birthdate',
      type: SkyCellType.Date,
    },
  ];
}

export function buildDefaultDataState(columnDefs: ColDef<AnimalProfileRow>[]): SkyDataManagerState {
  return new SkyDataManagerState({
    activeSortOption: {
      id: 'name',
      label: 'Name',
      descending: false,
      propertyName: 'name',
    },
    views: [
      {
        viewId: 'gridView',
        displayedColumnIds: columnDefs
          .filter((col) => col.field)
          .map((col) => col.field) as string[],
      },
    ],
  });
}
