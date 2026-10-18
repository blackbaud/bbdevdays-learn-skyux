import { TemplateRef } from '@angular/core';
import { SkyCellType } from '@skyux/ag-grid';
import { SkyDataManagerState } from '@skyux/data-manager';

import { ColDef } from 'ag-grid-community';

import { AnimalProfile } from '../../types/animal-profile';

export interface ColumnTemplates {
  menuTemplate: TemplateRef<unknown> | undefined;
  avatarTemplate: TemplateRef<unknown> | undefined;
  starTemplate: TemplateRef<unknown> | undefined;
  linkTemplate: TemplateRef<unknown> | undefined;
}

export function buildColumnDefs(templates: ColumnTemplates): ColDef<AnimalProfile>[] {
  return [
    {
      colId: 'menu',
      headerName: 'Context menu',
      type: SkyCellType.Template,
      headerComponentParams: {
        headerHidden: true,
      },
      cellRendererParams: {
        template: templates.menuTemplate,
      },
      width: 60,
      maxWidth: 60,
      resizable: false,
      suppressMovable: true,
      sortable: false,
    },
    {
      colId: 'image',
      headerName: 'Image',
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
      field: 'needsAttention',
      headerName: 'Needs attention?',
      type: SkyCellType.Template,
      cellRendererParams: {
        template: templates.starTemplate,
      },
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

export function buildDefaultDataState(columnDefs: ColDef<AnimalProfile>[]): SkyDataManagerState {
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
          .map((col) => col.colId ?? col.field)
          .filter((id): id is string => !!id),
      },
    ],
  });
}
