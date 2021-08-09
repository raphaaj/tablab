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

  testGetSectionSpacing(length: number): string {
    return this.getSectionSpacing(length);
  }

  testGetStringsSpacing(length: number): string {
    return this.getStringsSpacing(length);
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

      expect(tabElement.numberOfStrings).toBe(TestTabElement.DEFAULT_NUMBER_OF_STRINGS);
      expect(tabElement.sectionDivisionCharacter).toBe(
        TestTabElement.DEFAULT_SECTION_DIVISION_CHARACTER
      );
      expect(tabElement.spacing).toBe(TestTabElement.DEFAULT_SPACING);
      expect(tabElement.spacingCharacter).toBe(TestTabElement.DEFAULT_SPACING_CHARACTER);
    });

    it('should set the spacing character based on the given value', () => {
      const spacingCharacter = '@';
      const tabElement = new TestTabElement({ spacingCharacter });

      expect(tabElement.spacingCharacter).toBe(spacingCharacter);
    });

    it('should throw if the given spacing character is invalid', () => {
      const spacingCharacter = 'Test';

      expect(() => new TestTabElement({ spacingCharacter })).toThrow();
    });

    it('should set the number of strings based on the given value', () => {
      const numberOfStrings = 1;
      const tabElement = new TestTabElement({ numberOfStrings });

      expect(tabElement.numberOfStrings).toBe(numberOfStrings);
    });

    it('should throw if the given number of strings is invalid', () => {
      const numberOfStrings = 0;

      expect(() => new TestTabElement({ numberOfStrings })).toThrow();
    });

    it('should set the section division character based on the given value', () => {
      const sectionDivisionCharacter = '@';
      const tabElement = new TestTabElement({ sectionDivisionCharacter });

      expect(tabElement.sectionDivisionCharacter).toBe(sectionDivisionCharacter);
    });

    it('should throw if the given section division character is invalid', () => {
      const sectionDivisionCharacter = 'Test';

      expect(() => new TestTabElement({ sectionDivisionCharacter })).toThrow();
    });

    it('should set the spacing based on the given value', () => {
      const spacing = 1;
      const tabElement = new TestTabElement({ spacing });

      expect(tabElement.spacing).toBe(spacing);
    });

    it('should throw if the given spacing is invalid', () => {
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

  describe('[isNoteWritable]', () => {
    it('should return true if the note string is in the tab element strings range', () => {
      const numberOfStrings = 1;
      const tabElement = new TestTabElement({ numberOfStrings });
      const note = new Note(1, '0');

      expect(tabElement.isNoteWritable(note)).toBe(true);
    });

    it('should return false if the note string is smaller than the minimum tab element string value', () => {
      const numberOfStrings = 1;
      const tabElement = new TestTabElement({ numberOfStrings });
      const note = new Note(0, '0');

      expect(tabElement.isNoteWritable(note)).toBe(false);
    });

    it('should return false if the note string is greater than the maximum tab element string value', () => {
      const numberOfStrings = 1;
      const tabElement = new TestTabElement({ numberOfStrings });
      const note = new Note(numberOfStrings + 1, '0');

      expect(tabElement.isNoteWritable(note)).toBe(false);
    });
  });

  describe('[getStringsSpacing]', () => {
    it(`it should return a string with all characters equal to the tab element's spacing character and with the given length`, () => {
      const spacingCharacter = '+';
      const spacingLength = 5;

      const expectedSpacingString = Array(spacingLength + 1).join(spacingCharacter);
      const tabElement = new TestTabElement({ spacingCharacter });

      expect(tabElement.testGetStringsSpacing(spacingLength)).toBe(expectedSpacingString);
    });
  });

  describe('[getSectionSpacing]', () => {
    it(`should return a string with all characters equal to the tab element's section spacing character and with the given length`, () => {
      const spacingLength = 5;

      const expectedSpacingString = Array(spacingLength + 1).join(
        TabElement.DEFAULT_SECTION_SPACING_CHARACTER
      );

      const tabElement = new TestTabElement();

      expect(tabElement.testGetSectionSpacing(spacingLength)).toBe(expectedSpacingString);
    });
  });
});
