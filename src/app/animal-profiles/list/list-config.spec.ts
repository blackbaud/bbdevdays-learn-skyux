import { TemplateRef } from '@angular/core';
import { SkyCellType } from '@skyux/ag-grid';

import { buildColumnDefs, buildDefaultDataState, ColumnTemplates } from './list-config';

describe('list-config', () => {
  let templates: ColumnTemplates;

  beforeEach(() => {
    templates = {
      avatarTemplate: {} as TemplateRef<unknown>,
      starTemplate: {} as TemplateRef<unknown>,
      linkTemplate: {} as TemplateRef<unknown>,
    };
  });

  describe('buildColumnDefs()', () => {
    it('returns 7 column definitions', () => {
      const cols = buildColumnDefs(templates);
      expect(cols.length).toBe(7);
    });

    it('includes columns for menu, image, needsAttention, name, gender, breed, and birthdate', () => {
      const cols = buildColumnDefs(templates);
      const fields = cols.map((c) => c.field);
      expect(fields).toEqual([
        'menu',
        'image',
        'needsAttention',
        'name',
        'gender',
        'breed',
        'birthdate',
      ]);
    });

    it('wires avatarTemplate to the image column cellRendererParams', () => {
      const cols = buildColumnDefs(templates);
      const imageCol = cols.find((c) => c.field === 'image');
      expect(imageCol?.cellRendererParams?.['template']).toBe(templates.avatarTemplate);
    });

    it('wires starTemplate to the needsAttention column cellRendererParams', () => {
      const cols = buildColumnDefs(templates);
      const starCol = cols.find((c) => c.field === 'needsAttention');
      expect(starCol?.cellRendererParams?.['template']).toBe(templates.starTemplate);
    });

    it('wires linkTemplate to the name column cellRendererParams', () => {
      const cols = buildColumnDefs(templates);
      const nameCol = cols.find((c) => c.field === 'name');
      expect(nameCol?.cellRendererParams?.['template']).toBe(templates.linkTemplate);
    });

    it('marks the name column with an initial ascending sort', () => {
      const cols = buildColumnDefs(templates);
      const nameCol = cols.find((c) => c.field === 'name');
      expect(nameCol?.initialSort).toBe('asc');
    });

    it('uses SkyCellType.Template for image, needsAttention, and name columns', () => {
      const cols = buildColumnDefs(templates);
      for (const field of ['image', 'needsAttention', 'name']) {
        const col = cols.find((c) => c.field === field);
        expect(col?.type).toBe(SkyCellType.Template);
      }
    });

    it('uses SkyCellType.Date for the birthdate column', () => {
      const cols = buildColumnDefs(templates);
      const birthdateCol = cols.find((c) => c.field === 'birthdate');
      expect(birthdateCol?.type).toBe(SkyCellType.Date);
    });
  });

  describe('buildDefaultDataState()', () => {
    it('sets the default sort to name ascending', () => {
      const cols = buildColumnDefs(templates);
      const state = buildDefaultDataState(cols);
      expect(state.activeSortOption).toEqual(
        jasmine.objectContaining({
          id: 'name',
          propertyName: 'name',
          descending: false,
        }),
      );
    });

    it('includes all column field ids as displayed columns for gridView', () => {
      const cols = buildColumnDefs(templates);
      const state = buildDefaultDataState(cols);
      const gridView = state.views?.find((v) => v.viewId === 'gridView');
      expect(gridView?.displayedColumnIds).toEqual([
        'menu',
        'image',
        'needsAttention',
        'name',
        'gender',
        'breed',
        'birthdate',
      ]);
    });
  });
});
