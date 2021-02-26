import { Note } from '../../src/tab/note';
import { Tab } from '../../src/tab/tab';
import { TabBlock } from '../../src/tab/tab-block';

describe(`[${Tab.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a tab with the default parameters if no configuration is given', () => {
      const tab = new Tab();

      expect(tab.rows).toBe(Tab.DEFAULT_ROWS);
      expect(tab.filler).toBe(Tab.DEFAULT_FILLER);
      expect(tab.spacing).toBe(Tab.DEFAULT_SPACING);
      expect(tab.sectionSymbol).toBe(Tab.DEFAULT_SECTION_SYMBOL);
      expect(tab.sectionFiller).toBe(Tab.DEFAULT_SECTION_FILLER);
    });

    it('should set rows if set at instantiation', () => {
      const rows = 1;
      const tab = new Tab({ rows });

      expect(tab.rows).toBe(rows);
    });

    it('should throw if the given rows is invalid', () => {
      const rows = 0;

      expect(() => new Tab({ rows })).toThrow();
    });

    it('should set filler if set at instantiation', () => {
      const filler = '@';
      const tab = new Tab({ filler });

      expect(tab.filler).toBe(filler);
    });

    it('should throw if the given filler is invalid', () => {
      const filler = 'Test';

      expect(() => new Tab({ filler })).toThrow();
    });

    it('should set spacing if set at instantiation', () => {
      const spacing = 1;
      const tab = new Tab({ spacing });

      expect(tab.spacing).toBe(spacing);
    });

    it('should throw if the given spacing is invalid', () => {
      const spacing = 0;

      expect(() => new Tab({ spacing })).toThrow();
    });

    it('should set sectionSymbol if set at instantiation', () => {
      const sectionSymbol = '@';
      const tab = new Tab({ sectionSymbol });

      expect(tab.sectionSymbol).toBe(sectionSymbol);
    });

    it('should throw if the given sectionSymbol is invalid', () => {
      const sectionSymbol = 'Test';

      expect(() => new Tab({ sectionSymbol })).toThrow();
    });

    it('should set sectionFiller if set at instantiation', () => {
      const sectionFiller = '@';
      const tab = new Tab({ sectionFiller });

      expect(tab.sectionFiller).toBe(sectionFiller);
    });

    it('should throw if the given sectionFiller is invalid', () => {
      const sectionFiller = 'Test';

      expect(() => new Tab({ sectionFiller })).toThrow();
    });

    it('should be created with one tab block', () => {
      const tab = new Tab();

      expect(tab.blocks.length).toBe(1);
    });
  });

  describe('[properties]', () => {
    it('should set the spacing property for a valid value and add missing spacing to current block', () => {
      const tab = new Tab();
      const additionalSpacing = 10;
      const spacing = tab.spacing + additionalSpacing;

      const addSpacingSpy = jest.spyOn(TabBlock.prototype, 'addSpacing');
      tab.spacing = spacing;

      expect(addSpacingSpy).toHaveBeenCalledWith(additionalSpacing);
      addSpacingSpy.mockRestore();
    });

    it('should set the spacing property for a valid value and remove extra spacing from current block', () => {
      const tab = new Tab();
      const spacingToRemove = 1;
      const spacing = tab.spacing - spacingToRemove;

      const removeSpacingSpy = jest.spyOn(TabBlock.prototype, 'removeSpacing');
      tab.spacing = spacing;

      expect(removeSpacingSpy).toHaveBeenCalledWith(spacingToRemove);
      removeSpacingSpy.mockRestore();
    });

    it('should neither add or remove spacing from current block is the new spacing is the same as the current spacing', () => {
      const tab = new Tab();
      const currentSpacing = tab.spacing;

      const addSpacingSpy = jest.spyOn(TabBlock.prototype, 'addSpacing');
      const removeSpacingSpy = jest.spyOn(TabBlock.prototype, 'removeSpacing');

      tab.spacing = currentSpacing;

      expect(addSpacingSpy).not.toHaveBeenCalled();
      expect(removeSpacingSpy).not.toHaveBeenCalled();
      addSpacingSpy.mockRestore();
      removeSpacingSpy.mockRestore();
    });

    it('should throw if the spacing property is set to a no positive value', () => {
      const spacing = 0;
      const tab = new Tab();

      expect(() => (tab.spacing = spacing)).toThrow();
    });
  });

  describe('[addBlock]', () => {
    it('should add a new tab block to the tab', () => {
      const tab = new Tab();

      tab.addBlock();

      expect(tab.blocks.length).toBe(2);
    });
  });

  describe('[addSpacing]', () => {
    it('should add spacing to the last tab block', () => {
      const spacing = 5;
      const tab = new Tab();

      tab.addBlock().addSpacing(spacing);

      tab.blocks[1].forEach((blockElement, blockElementIdx) => {
        if (blockElementIdx !== 0 && blockElementIdx !== tab.rows + 1) {
          expect(blockElement.length).toBe(spacing + tab.spacing);
        }
      });
    });
  });

  describe('[removeSpacing]', () => {
    it('should remove spacing from the last tab block', () => {
      const spacing = 1;
      const tab = new Tab();

      tab.addBlock().removeSpacing(spacing);

      tab.blocks[1].forEach((blockElement, blockElementIdx) => {
        if (blockElementIdx !== 0 && blockElementIdx !== tab.rows + 1) {
          expect(blockElement.length).toBe(tab.spacing - spacing);
        }
      });
    });
  });

  describe('[writeNote]', () => {
    it('should add a instruction to the last tab block', () => {
      const string = 1;
      const instruction = '1/2';
      const note = new Note(string, instruction);
      const tab = new Tab();

      tab.addBlock().writeNote(note);

      expect(tab.blocks[1][string]).toContain(instruction);
    });
  });

  describe('[writeParallelNotes]', () => {
    it('should add merged instructions to the last tab block', () => {
      const tab = new Tab();
      const stringInstructionMap: Record<number, string> = { 1: '1/2', 2: '2' };
      const notes = Object.keys(stringInstructionMap).map((stringStr) => {
        const string = parseInt(stringStr, 10);
        return new Note(string, stringInstructionMap[string]);
      });

      tab.addBlock().writeParallelNotes(notes);

      Object.keys(stringInstructionMap).map((stringStr) => {
        const string = parseInt(stringStr, 10);
        expect(tab.blocks[1][string]).toContain(stringInstructionMap[string]);
      });
    });
  });

  describe('[writeHeader]', () => {
    it('should write a header to the last tab block', () => {
      const headerName = 'some tab header';
      const tab = new Tab();

      tab.addBlock().writeHeader(headerName);

      expect(tab.blocks[1][0]).toContain(headerName);
    });
  });

  describe('[writeFooter]', () => {
    it('should write a footer to the last tab block', () => {
      const footer = 'some tab footer';
      const tab = new Tab();

      tab.addBlock().writeFooter(footer);

      expect(tab.blocks[1][tab.rows + 1]).toContain(footer);
    });
  });
});
