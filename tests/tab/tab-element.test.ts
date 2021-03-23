import { TabElement } from '../../src/tab/tab-element';
import { Note } from '../../src/tab/note';

class TestTabElement extends TabElement {
  addSpacing(): this {
    throw new Error('Method not implemented.');
  }

  format(): string[][] {
    throw new Error('Method not implemented.');
  }

  onSpacingChange(oldValue: number, value: number): void {
    super.onSpacingChange(oldValue, value);
  }

  removeSpacing(): this {
    throw new Error('Method not implemented.');
  }

  testGetRowsFiller(fillerLength: number): string {
    return this.getRowsFiller(fillerLength);
  }

  testGetSectionFiller(fillerLength: number): string {
    return this.getSectionFiller(fillerLength);
  }

  writeFooter(): this {
    throw new Error('Method not implemented.');
  }

  writeHeader(): this {
    throw new Error('Method not implemented.');
  }

  writeNote(): this {
    throw new Error('Method not implemented.');
  }

  writeParallelNotes(): this {
    throw new Error('Method not implemented.');
  }
}

describe(`[${TabElement.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a tab element with the default options if no custom options are given', () => {
      const tabElement = new TestTabElement();

      expect(tabElement.filler).toBe(TestTabElement.DEFAULT_FILLER);
      expect(tabElement.numberOfRows).toBe(TestTabElement.DEFAULT_NUMBER_OF_ROWS);
      expect(tabElement.sectionFiller).toBe(TestTabElement.DEFAULT_SECTION_FILLER);
      expect(tabElement.sectionSymbol).toBe(TestTabElement.DEFAULT_SECTION_SYMBOL);
      expect(tabElement.spacing).toBe(TestTabElement.DEFAULT_SPACING);
    });

    it('should set the filler based on the given value', () => {
      const filler = '@';
      const tabElement = new TestTabElement({ filler });

      expect(tabElement.filler).toBe(filler);
    });

    it('should throw if the given value for filler is invalid', () => {
      const filler = 'Test';

      expect(() => new TestTabElement({ filler })).toThrow();
    });

    it('should set the number of rows based on the given value', () => {
      const numberOfRows = 1;
      const tabElement = new TestTabElement({ numberOfRows });

      expect(tabElement.numberOfRows).toBe(numberOfRows);
    });

    it('should throw if the given value for number of rows is invalid', () => {
      const numberOfRows = 0;

      expect(() => new TestTabElement({ numberOfRows })).toThrow();
    });

    it('should set the sectionFiller based on the given value', () => {
      const sectionFiller = '@';
      const tabElement = new TestTabElement({ sectionFiller });

      expect(tabElement.sectionFiller).toBe(sectionFiller);
    });

    it('should throw if the given value for sectionFiller is invalid', () => {
      const sectionFiller = 'Test';

      expect(() => new TestTabElement({ sectionFiller })).toThrow();
    });

    it('should set the sectionSymbol based on the given value', () => {
      const sectionSymbol = '@';
      const tabElement = new TestTabElement({ sectionSymbol });

      expect(tabElement.sectionSymbol).toBe(sectionSymbol);
    });

    it('should throw if the given value for sectionSymbol is invalid', () => {
      const sectionSymbol = 'Test';

      expect(() => new TestTabElement({ sectionSymbol })).toThrow();
    });

    it('should set the spacing based on the given value', () => {
      const spacing = 1;
      const tabElement = new TestTabElement({ spacing });

      expect(tabElement.spacing).toBe(spacing);
    });

    it('should throw if the given value for spacing is invalid', () => {
      const spacing = 0;

      expect(() => new TestTabElement({ spacing })).toThrow();
    });
  });

  describe('[properties]', () => {
    describe('[spacing]', () => {
      it('should throw if the given spacing value is smaller than 1', () => {
        const spacing = 0;
        const tabElement = new TestTabElement();

        expect(() => (tabElement.spacing = spacing)).toThrow();
      });

      it('should call onSpacingChange when the spacing value is set to a valid value', () => {
        const oldSpacingValue = 2;
        const spacing = 1;
        const tabElement = new TestTabElement({ spacing: oldSpacingValue });

        tabElement.onSpacingChange = jest.fn(tabElement.onSpacingChange);
        tabElement.spacing = spacing;

        expect(tabElement.onSpacingChange).toHaveBeenCalledWith(oldSpacingValue, spacing);
        expect(tabElement.spacing).toBe(spacing);
      });
    });
  });

  describe('[setSpacing]', () => {
    it('should set the tab element spacing', () => {
      const oldSpacingValue = 2;
      const spacing = 1;
      const tabElement = new TestTabElement({ spacing: oldSpacingValue });

      tabElement.setSpacing(spacing);

      expect(tabElement.spacing).toBe(spacing);
    });
  });

  describe('[isNoteInStringsRange]', () => {
    it('should return true if the note string is in the tab element rows range', () => {
      const numberOfRows = 1;
      const tabElement = new TestTabElement({ numberOfRows });
      const note = new Note(1, '0');

      expect(tabElement.isNoteInStringsRange(note)).toBe(true);
    });

    it('should return false if the note string is smaller than the minimum tab element string value', () => {
      const numberOfRows = 1;
      const tabElement = new TestTabElement({ numberOfRows });
      const note = new Note(0, '0');

      expect(tabElement.isNoteInStringsRange(note)).toBe(false);
    });

    it('should return false if the note string is greater than the maximum tab element string value', () => {
      const numberOfRows = 1;
      const tabElement = new TestTabElement({ numberOfRows });
      const note = new Note(numberOfRows + 1, '0');

      expect(tabElement.isNoteInStringsRange(note)).toBe(false);
    });
  });

  describe('[getRowsFiller]', () => {
    it('should return a string composed with the tab element filler character with the specified length', () => {
      const filler = '+';
      const fillerLength = 5;
      const expectedRowsFiller = Array(fillerLength + 1).join(filler);
      const tabElement = new TestTabElement({ filler });

      expect(tabElement.testGetRowsFiller(fillerLength)).toBe(expectedRowsFiller);
    });
  });

  describe('[getSectionFiller]', () => {
    it('should return a string composed with the tab element section filler character with the specified length', () => {
      const sectionFiller = '+';
      const fillerLength = 5;
      const expectedSectionFiller = Array(fillerLength + 1).join(sectionFiller);
      const tabElement = new TestTabElement({ sectionFiller });

      expect(tabElement.testGetSectionFiller(fillerLength)).toBe(expectedSectionFiller);
    });
  });
});
