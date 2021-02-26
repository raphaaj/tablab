import { Note } from '../../src/tab/note';
import { Tab } from '../../src/tab/tab';
import { TabBlock } from '../../src/tab/tab-block';

describe(`[${TabBlock.name}]`, () => {
  describe('[constructor]', () => {
    it('should initialize the tab block rows based on the given tab', () => {
      const tab = new Tab();

      const tabBlock = new TabBlock(tab);

      expect(tabBlock.rows.length).toBe(tab.rows);
    });

    it('should initialize the tab block rows with spacing, based on the given tab', () => {
      const tab = new Tab();
      const expectedRowValue = Array(tab.spacing + 1).join(tab.filler);

      const tabBlock = new TabBlock(tab);

      tabBlock.rows.forEach((row) => {
        expect(row).toBe(expectedRowValue);
      });
    });
  });

  describe('[properties]', () => {
    it('should give access to the block header section', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);

      expect(tabBlock.block[tabBlock.blockHeaderIdx]).toBe(tabBlock.header);
    });

    it('should give access to the block footer section', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);

      expect(tabBlock.block[tabBlock.blockFooterIdx]).toBe(tabBlock.footer);
    });

    it('should give access to the block rows', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);

      expect(
        tabBlock.block.slice(tabBlock.blockRowsStartIdx, tabBlock.blockRowsEndIdx + 1)
      ).toEqual(tabBlock.rows);
    });

    it('should trim the header if it is greater than the rows', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToRemove = 1;

      tabBlock.writeHeader('some header');
      const expectedHeader = tabBlock.header.slice(0, tabBlock.header.length - spacingToRemove);

      tab.spacing = tab.spacing - spacingToRemove;
      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.header).toBe(expectedHeader);
    });

    it('should trim the footer if it is greater than the rows', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToRemove = 1;

      tabBlock.writeFooter('some footer');
      const expectedFooter = tabBlock.footer.slice(0, tabBlock.footer.length - spacingToRemove);

      tab.spacing = tab.spacing - spacingToRemove;
      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.footer).toBe(expectedFooter);
    });
  });

  describe('[addSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToAdd = 0;

      expect(() => tabBlock.addSpacing(spacingToAdd)).toThrow();
    });

    it('should add fillers to all rows with the given spacing length when valid', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToAdd = 10;

      const expectedFiller = Array(spacingToAdd + 1).join(tab.filler);
      const expectedRowsFinalValue = tabBlock.rows.map((row) => row + expectedFiller);
      tabBlock.addSpacing(spacingToAdd);

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });

    it('should add fillers to all rows with the tab spacing length when no spacing value is given', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);

      const expectedFiller = Array(tab.spacing + 1).join(tab.filler);
      const expectedRowsFinalValue = tabBlock.rows.map((row) => row + expectedFiller);
      tabBlock.addSpacing();

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });
  });

  describe('[removeSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToRemove = 0;

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should throw if the given spacing exceeds the maximum removable spacing', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToRemove = 2;
      const maxRemovableSpacing = spacingToRemove - 1;

      tabBlock.getMaximumRemovableSpacing = jest.fn().mockReturnValue(maxRemovableSpacing);

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should remove fillers from all rows by the spacing length provided when valid', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const spacingToRemove = 1;

      const expectedRowsFinalValue = tabBlock.rows.map((row) =>
        row.slice(0, row.length - spacingToRemove)
      );
      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });

    it('should remove fillers from all rows by the tab spacing length when no spacing value is given', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);

      const expectedRowsFinalValue = tabBlock.rows.map((row) =>
        row.slice(0, row.length - tab.spacing)
      );
      tabBlock.removeSpacing();

      expect(tabBlock.rows).toEqual(expectedRowsFinalValue);
    });
  });

  describe('[getMaximumRemovableSpacing]', () => {
    it('should return the minimum number of sequential filler characters from each row end based on all rows', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const noteToWrite = new Note(1, '1/2');
      tabBlock.writeNote(noteToWrite);

      const maximumRemovableSpacing = tabBlock.getMaximumRemovableSpacing();

      expect(maximumRemovableSpacing).toBe(tab.spacing);
    });
  });

  describe(`[writeNote]`, () => {
    it('should call the writeParallelNotes method with the given note', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const noteToWrite = new Note(1, '1/2');
      const expectedNotesToWrite = [noteToWrite];

      tabBlock.writeParallelNotes = jest.fn();
      tabBlock.writeNote(noteToWrite);

      expect(tabBlock.writeParallelNotes).toHaveBeenCalledWith(expectedNotesToWrite);
    });
  });

  describe('[writeParallelNotes]', () => {
    it(`should throw if the given note's string is smaller than 1`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const invalidString = 0;
      const noteToWrite = new Note(invalidString, '1/2');

      expect(() => tabBlock.writeParallelNotes([noteToWrite])).toThrow();
    });

    it(`should throw if there are more than one note's string smaller than 1`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const invalidStrings = [-1, 0];
      const notesToWrite = invalidStrings.map((string) => new Note(string, '1/2'));

      expect(() => tabBlock.writeParallelNotes(notesToWrite)).toThrow();
    });

    it(`should throw if the given note's string is greater than the tab rows`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const invalidString = tab.rows + 1;
      const noteToWrite = new Note(invalidString, '1/2');

      expect(() => tabBlock.writeParallelNotes([noteToWrite])).toThrow();
    });

    it(`should throw if there are more than one note's string greater than the tab rows`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const invalidStrings = [tab.rows + 1, tab.rows + 2];
      const notesToWrite = invalidStrings.map((string) => new Note(string, '1/2'));

      expect(() => tabBlock.writeParallelNotes(notesToWrite)).toThrow();
    });

    it('should throw if there are multiple instructions apllied to the same string', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const string = 1;
      const instructions = ['1/2', '2/1'];
      const notesToWrite = instructions.map((instr) => new Note(string, instr));

      expect(() => tabBlock.writeParallelNotes(notesToWrite)).toThrow();
    });

    it(`should throw if there are more than one note's string with multiple instructions applied to it`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const strings = [1, 2];
      const instructions = ['1/2', '2/1'];
      const notesToWrite = strings.flatMap((string) =>
        instructions.map((instr) => new Note(string, instr))
      );

      expect(() => tabBlock.writeParallelNotes(notesToWrite)).toThrow();
    });

    it('should write instructions on the specified strings and add spacing based on tab spacing', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const strings = Array.from({ length: tab.rows }, (_, index) => index + 1);
      const notesToWrite = strings.map((string) => new Note(string, `${string}/${string + 1}`));

      tabBlock.writeParallelNotes(notesToWrite);

      tabBlock.rows.forEach((row, rowIdx) => {
        const expectedRowInstruction = notesToWrite[rowIdx].fret;
        const rowInstruction = row.slice(tab.spacing, tab.spacing + expectedRowInstruction.length);
        expect(rowInstruction).toBe(expectedRowInstruction);

        const nonTabFillerMatcher = new RegExp(`[^${tab.filler}]`, 'g');
        const rowWithoutInstruction = row.split(rowInstruction).join('');
        expect(rowWithoutInstruction).not.toMatch(nonTabFillerMatcher);

        expect(rowWithoutInstruction).toHaveLength(tab.spacing * 2);
      });
    });

    it('should add equivalent spacing on non written strings and add spacing based on tab', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const strings = [1, 2];
      const notesToWrite = strings.map((string) => new Note(string, `${string}/${string + 1}`));
      const maxInstructionLength = notesToWrite.reduce(
        (maxInstructionLength, noteToWrite) =>
          noteToWrite.fret.length > maxInstructionLength
            ? noteToWrite.fret.length
            : maxInstructionLength,
        0
      );

      tabBlock.writeParallelNotes(notesToWrite);

      tabBlock.rows.forEach((row, rowIdx) => {
        if (strings.indexOf(rowIdx + 1) > -1) {
          expect(row).toContain(notesToWrite[rowIdx].fret);
        } else {
          const nonTabFillerMatcher = new RegExp(`[^${tab.filler}]`, 'g');
          expect(row).not.toMatch(nonTabFillerMatcher);
          expect(row).toHaveLength(tab.spacing * 2 + maxInstructionLength);
        }
      });
    });
  });

  describe('[writeHeader]', () => {
    it('should throw if an empty header is given', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const header = '  ';

      expect(() => tabBlock.writeHeader(header)).toThrow();
    });

    it(`should write the given header to the header section, preceded by the tab's section symbol`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const header = 'some header';

      const expectedHeader =
        tabBlock.header +
        tab.sectionSymbol +
        tab.sectionFiller +
        header +
        Array(tab.spacing + 1).join(tab.sectionFiller);

      tabBlock.writeHeader(header);

      expect(tabBlock.header).toBe(expectedHeader);
    });

    it(`should write the section symbol to the rows and fill them with filler to the header's end`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const header = 'some header';

      const expectedRows = tabBlock.rows.map(
        (row) =>
          row +
          tab.sectionSymbol +
          Array(tab.sectionFiller.length + header.length + tab.spacing + 1).join(tab.filler)
      );

      tabBlock.writeHeader(header);

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it('should keep writing notes on rows based on tab spacing despite of the added filler after a header is written', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const string = 1;
      const instruction = '1/2';
      const header = 'some header';

      const expectedRows = tabBlock.rows.map((row, idx) =>
        idx === string - 1
          ? row +
            tab.sectionSymbol +
            Array(tab.spacing + 1).join(tab.filler) +
            instruction +
            Array(tab.sectionFiller.length + header.length - instruction.length + 1).join(
              tab.filler
            )
          : row +
            tab.sectionSymbol +
            Array(tab.sectionFiller.length + header.length + tab.spacing + 1).join(tab.filler)
      );

      tabBlock.writeHeader(header).writeNote(new Note(string, instruction));

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it(`should write the section symbol to the footer and fill it with filler to the header's end`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const header = 'some header';

      const expectedFooter =
        tabBlock.footer +
        tab.sectionSymbol +
        Array(tab.sectionFiller.length + header.length + tab.spacing + 1).join(tab.sectionFiller);

      tabBlock.writeHeader(header);

      expect(tabBlock.footer).toBe(expectedFooter);
    });
  });

  describe('[writeFooter]', () => {
    it('should throw if an empty footer is given', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const footer = '  ';

      expect(() => tabBlock.writeFooter(footer)).toThrow();
    });

    it(`should write the given footer to the footer section, preceded by the tab's section symbol`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const footer = 'some footer';

      const sectionBaseFiller = Array(tab.spacing + 1).join(tab.sectionFiller);
      const expectedFooter =
        sectionBaseFiller + footer + tab.sectionFiller + tab.sectionSymbol + sectionBaseFiller;

      tabBlock.writeFooter(footer);

      expect(tabBlock.footer).toBe(expectedFooter);
    });

    it(`should fill the rows with filler to the footer's end and write the tab's section symbol and spacing`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const footer = 'some footer';

      const expectedRows = tabBlock.rows.map(
        (row) =>
          row +
          Array(footer.length + tab.sectionFiller.length + 1).join(tab.filler) +
          tab.sectionSymbol +
          Array(tab.spacing + 1).join(tab.filler)
      );

      tabBlock.writeFooter(footer);

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it('should not add filler to the rows if there is already space to add the given footer', () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const footer = 'some footer';

      tabBlock.addSpacing(footer.length + 1);

      const expectedRows = tabBlock.rows.map(
        (row) => row + tab.sectionSymbol + Array(tab.spacing + 1).join(tab.filler)
      );

      tabBlock.writeFooter(footer);

      expect(tabBlock.rows).toEqual(expectedRows);
    });

    it(`should fill the header with filler to the footer end and add the tab's section symbol and spacing`, () => {
      const tab = new Tab();
      const tabBlock = new TabBlock(tab);
      const footer = 'some footer';

      const expectedHeader =
        tabBlock.header +
        Array(footer.length + tab.sectionFiller.length + 1).join(tab.sectionFiller) +
        tab.sectionSymbol +
        Array(tab.spacing + 1).join(tab.sectionFiller);

      tabBlock.writeFooter(footer);

      expect(tabBlock.header).toBe(expectedHeader);
    });
  });
});
