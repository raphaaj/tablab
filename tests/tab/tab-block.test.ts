import { TabBlock } from '../../src/tab/tab-block';
import { Note } from '../../src/tab/note';

describe(`[${TabBlock.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a tab block with the default options if no custom options are given', () => {
      const tabBlock = new TabBlock();

      expect(tabBlock.filler).toBe(TabBlock.DEFAULT_FILLER);
      expect(tabBlock.numberOfStrings).toBe(TabBlock.DEFAULT_NUMBER_OF_STRINGS);
      expect(tabBlock.sectionFiller).toBe(TabBlock.DEFAULT_SECTION_FILLER);
      expect(tabBlock.sectionSymbol).toBe(TabBlock.DEFAULT_SECTION_SYMBOL);
      expect(tabBlock.spacing).toBe(TabBlock.DEFAULT_SPACING);
    });

    it('should create a tab block with the given options', () => {
      const filler = '@';
      const numberOfStrings = 2;
      const sectionFiller = '$';
      const sectionSymbol = '#';
      const spacing = 1;

      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing,
      });

      expect(tabBlock.filler).toBe(filler);
      expect(tabBlock.numberOfStrings).toBe(numberOfStrings);
      expect(tabBlock.sectionFiller).toBe(sectionFiller);
      expect(tabBlock.sectionSymbol).toBe(sectionSymbol);
      expect(tabBlock.spacing).toBe(spacing);
    });

    it('should initialize the block header section', () => {
      const sectionFiller = '@';
      const spacing = 2;
      const expectedHeader = Array(spacing + 1).join(sectionFiller);

      const tabBlock = new TabBlock({ sectionFiller, spacing });

      expect(tabBlock.block[0]).toBe(expectedHeader);
    });

    it('should initialize the block footer section', () => {
      const numberOfStrings = 4;
      const sectionFiller = '@';
      const spacing = 2;
      const expectedFooter = Array(spacing + 1).join(sectionFiller);

      const tabBlock = new TabBlock({ numberOfStrings, sectionFiller, spacing });

      expect(tabBlock.block[numberOfStrings + 1]).toBe(expectedFooter);
    });

    it('should initialize the block strings section', () => {
      const numberOfStrings = 4;
      const filler = '@';
      const spacing = 2;
      const expectedStringsValue = Array(spacing + 1).join(filler);

      const tabBlock = new TabBlock({ filler, spacing, numberOfStrings });

      tabBlock.block
        .slice(1, numberOfStrings + 1)
        .forEach((string) => expect(string).toBe(expectedStringsValue));
    });
  });

  describe('[properties]', () => {
    describe('[header]', () => {
      it('should return the block header section', () => {
        const tabBlock = new TabBlock();

        expect(tabBlock.header).toBe(tabBlock.block[0]);
      });

      it('should return the block header section cropped if it has filler characters exceeding the strings section length', () => {
        const spacing = 2;
        const tabBlock = new TabBlock({ spacing });
        const spacingToRemove = 1;

        tabBlock.writeHeader('some header');
        const expectedHeader = tabBlock.header.slice(0, tabBlock.header.length - spacingToRemove);

        tabBlock.spacing = tabBlock.spacing - spacingToRemove;

        expect(tabBlock.header).toBe(expectedHeader);
      });
    });

    describe('[footer]', () => {
      it('should return the block footer section', () => {
        const numberOfStrings = 4;
        const tabBlock = new TabBlock({ numberOfStrings });

        expect(tabBlock.footer).toBe(tabBlock.block[numberOfStrings + 1]);
      });

      it('should return the block footer section cropped if it has filler characters exceeding the strings section length', () => {
        const spacing = 2;
        const tabBlock = new TabBlock({ spacing });
        const spacingToRemove = 1;

        tabBlock.writeFooter('some footer');
        const expectedFooter = tabBlock.footer.slice(0, tabBlock.footer.length - spacingToRemove);

        tabBlock.spacing = tabBlock.spacing - spacingToRemove;

        expect(tabBlock.footer).toBe(expectedFooter);
      });
    });

    describe('[strings]', () => {
      it('should return the block strings section', () => {
        const numberOfStrings = 4;
        const tabBlock = new TabBlock({ numberOfStrings });

        tabBlock.strings.forEach((string, stringIdx) => {
          const stringBlockIdx = stringIdx + 1;

          expect(string).toBe(tabBlock.block[stringBlockIdx]);
        });
      });
    });

    describe('[spacing]', () => {
      it('should add spacing to the block based on the difference from the new spacing to the previous spacing value', () => {
        const spacing = 2;
        const tabBlock = new TabBlock({ spacing });
        const newSpacing = 10;

        tabBlock.addSpacing = jest.fn(tabBlock.addSpacing);
        tabBlock.spacing = newSpacing;

        expect(tabBlock.addSpacing).toHaveBeenCalledWith(newSpacing - spacing);
        expect(tabBlock.spacing).toBe(newSpacing);
      });

      it('should remove spacing from the block base on the difference from the new spacing to the previous spacing value', () => {
        const spacing = 10;
        const tabBlock = new TabBlock({ spacing });
        const newSpacing = 2;

        tabBlock.removeSpacing = jest.fn(tabBlock.removeSpacing);
        tabBlock.spacing = newSpacing;

        expect(tabBlock.removeSpacing).toHaveBeenCalledWith(spacing - newSpacing);
        expect(tabBlock.spacing).toBe(newSpacing);
      });

      it('should neither add or remove spacing from the block if the spacing value does not change', () => {
        const spacing = 5;
        const tabBlock = new TabBlock({ spacing });

        tabBlock.addSpacing = jest.fn(tabBlock.addSpacing);
        tabBlock.removeSpacing = jest.fn(tabBlock.removeSpacing);
        tabBlock.spacing = spacing;

        expect(tabBlock.addSpacing).not.toHaveBeenCalled();
        expect(tabBlock.removeSpacing).not.toHaveBeenCalled();
        expect(tabBlock.spacing).toBe(spacing);
      });
    });
  });

  describe('[addSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const tabBlock = new TabBlock();
      const spacingToAdd = 0;

      expect(() => tabBlock.addSpacing(spacingToAdd)).toThrow();
    });

    it('should add fillers to all strings with the given spacing length when valid', () => {
      const filler = '@';
      const tabBlock = new TabBlock({ filler });
      const spacingToAdd = 10;
      const expectedStringsValue = tabBlock.strings.map(
        (string) => string + Array(spacingToAdd + 1).join(filler)
      );

      tabBlock.addSpacing(spacingToAdd);

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it('should add fillers to all strings with the block spacing length when no spacing value is given', () => {
      const spacing = 2;
      const filler = '@';
      const tabBlock = new TabBlock({ filler, spacing });
      const expectedStringsValue = tabBlock.strings.map(
        (string) => string + Array(spacing + 1).join(filler)
      );

      tabBlock.addSpacing();

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });
  });

  describe('[format]', () => {
    it('should throw if the given block length is smaller than the minimum acceptable length', () => {
      const blockLength = TabBlock.MINIMUM_BLOCK_LENGTH - 1;
      const tabBlock = new TabBlock();

      expect(() => tabBlock.format(blockLength)).toThrow();
    });

    it('should return 1 block with the given block length if the block length is smaller than the given block length', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const spacing = 7;
      const sectionFiller = ' ';
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        spacing,
      });
      const string = 1;
      const fret = '0';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '-------0------------',
          '--------------------',
          '                    ',
        ],
      ];

      tabBlock.writeNote(new Note(string, fret));
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in multiple blocks with the given block length if the block length is greater than the given block length', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const spacing = 15;
      const sectionFiller = ' ';
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        spacing,
      });
      const string = 1;
      const fret = '0';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '---------------0----',
          '--------------------',
          '                    ',
        ],
        [
          '                    ',
          '--------------------',
          '--------------------',
          '                    ',
        ],
      ];

      tabBlock.writeNote(new Note(string, fret));
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should not split the block in the middle of a header, when possible', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const spacingBeforeHeader = 10;
      const spacingAfterHeader = 2;
      const sectionFiller = ' ';
      const sectionSymbol = '|';
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing: spacingBeforeHeader,
      });
      const header = 'test header';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '--------------------',
          '--------------------',
          '                    ',
        ],
        [
          ' | test header      ',
          '-|------------------',
          '-|------------------',
          ' |                  ',
        ],
      ];

      tabBlock.writeHeader(header);
      tabBlock.spacing = spacingAfterHeader;
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should not split the block in the middle of a footer, when possible', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const spacingBeforeFooter = 10;
      const spacingAfterFooter = 2;
      const sectionFiller = ' ';
      const sectionSymbol = '|';
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing: spacingBeforeFooter,
      });
      const footer = 'test footer';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '--------------------',
          '--------------------',
          '                    ',
        ],
        [
          '             |      ',
          '-------------|------',
          '-------------|------',
          ' test footer |      ',
        ],
      ];

      tabBlock.writeFooter(footer);
      tabBlock.spacing = spacingAfterFooter;
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should not split the block in the middle of a string fret instruction, when possible', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const spacingBeforeNote = 15;
      const spacingAfterNote = 2;
      const sectionFiller = ' ';
      const sectionSymbol = '|';
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing: spacingBeforeNote,
      });
      const string = 1;
      const fret = '0h2p0';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '--------------------',
          '--------------------',
          '                    ',
        ],
        [
          '                    ',
          '-0h2p0--------------',
          '--------------------',
          '                    ',
        ],
      ];

      tabBlock.writeNote(new Note(string, fret));
      tabBlock.spacing = spacingAfterNote;
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in the middle of a header when unable to split it without breaking the header', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const sectionFiller = ' ';
      const sectionSymbol = '|';
      const spacing = 1;
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing,
      });
      const header = 'a long enough header';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          ' | a long enough he ',
          '-|------------------',
          '-|------------------',
          ' |                  ',
        ],
        [
          'ader                ',
          '--------------------',
          '--------------------',
          '                    ',
        ],
      ];

      tabBlock.writeHeader(header);
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in the middle of a footer when unable to split it without breaking the footer', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const sectionFiller = ' ';
      const sectionSymbol = '|';
      const spacing = 1;
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing,
      });
      const footer = 'a long enough footer';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '--------------------',
          '--------------------',
          ' a long enough foot ',
        ],
        [
          '   |                ',
          '---|----------------',
          '---|----------------',
          'er |                ',
        ],
      ];

      tabBlock.writeFooter(footer);
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in the middle of a string fret instruction when unable to split it without breaking the instruction', () => {
      const filler = '-';
      const numberOfStrings = 2;
      const sectionFiller = ' ';
      const sectionSymbol = '|';
      const spacing = 1;
      const tabBlock = new TabBlock({
        filler,
        numberOfStrings,
        sectionFiller,
        sectionSymbol,
        spacing,
      });
      const string = 1;
      const fret = 'a_long_enough_instruction';
      const blockLength = 20;

      const expectedFormattedBlock = [
        [
          '                    ',
          '-a_long_enough_inst-',
          '--------------------',
          '                    ',
        ],
        [
          '                    ',
          'ruction-------------',
          '--------------------',
          '                    ',
        ],
      ];

      tabBlock.writeNote(new Note(string, fret));
      const formattedTabBlock = tabBlock.format(blockLength);

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });
  });

  describe('[removeSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const tabBlock = new TabBlock();
      const spacingToRemove = 0;

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should throw if the given spacing exceeds the maximum removable spacing', () => {
      const spacing = 2;
      const tabBlock = new TabBlock({ spacing });
      const spacingToRemove = spacing + 1;

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should remove fillers from all strings by the given spacing length when valid', () => {
      const spacing = 2;
      const tabBlock = new TabBlock({ spacing });
      const spacingToRemove = 1;
      const expectedStringsValue = tabBlock.strings.map((string) =>
        string.slice(0, string.length - spacingToRemove)
      );

      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it('should remove fillers from all strings by the block spacing length when no spacing value is given', () => {
      const spacing = 2;
      const tabBlock = new TabBlock({ spacing });
      const expectedStringsValue = tabBlock.strings.map((string) =>
        string.slice(0, string.length - spacing)
      );

      tabBlock.removeSpacing();

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });
  });

  describe(`[writeNote]`, () => {
    it('should write the given note in parallel with no other note', () => {
      const tabBlock = new TabBlock();
      const string = 1;
      const fret = '1/2';
      const noteToWrite = new Note(string, fret);

      tabBlock.writeParallelNotes = jest.fn(tabBlock.writeParallelNotes);
      tabBlock.writeNote(noteToWrite);

      expect(tabBlock.writeParallelNotes).toHaveBeenCalledWith([noteToWrite]);
      expect(tabBlock.strings[string - 1]).toContain(fret);
    });
  });

  describe('[getMaximumRemovableSpacing]', () => {
    it('should return the minimum number of sequential filler characters from all strings backwards', () => {
      const spacing = 2;
      const tabBlock = new TabBlock({ spacing });
      const noteToWrite = new Note(1, '1/2');

      tabBlock.writeNote(noteToWrite);
      const maximumRemovableSpacing = tabBlock.getMaximumRemovableSpacing();

      expect(maximumRemovableSpacing).toBe(spacing);
    });
  });

  describe('[writeParallelNotes]', () => {
    it(`should throw if any of the given notes have a string value smaller than 1`, () => {
      const tabBlock = new TabBlock();
      const invalidString = 0;
      const noteToWrite = new Note(invalidString, '1/2');

      expect(() => tabBlock.writeParallelNotes([noteToWrite])).toThrow();
    });

    it(`should throw if any of the given notes have a string value greater than the block strings number`, () => {
      const numberOfStrings = 4;
      const tabBlock = new TabBlock({ numberOfStrings });
      const invalidString = numberOfStrings + 1;
      const noteToWrite = new Note(invalidString, '1/2');

      expect(() => tabBlock.writeParallelNotes([noteToWrite])).toThrow();
    });

    it('should throw if any set of the given notes, shares the same string value', () => {
      const numberOfStrings = 4;
      const tabBlock = new TabBlock({ numberOfStrings });
      const sharedString = 1;
      const fretInstructions = ['1/2', '2/1'];

      const notesToWrite = fretInstructions.map((fret) => new Note(sharedString, fret));

      expect(() => tabBlock.writeParallelNotes(notesToWrite)).toThrow();
    });

    it('should write, in parallel, the fret instructions on the specified string and add spacing based on block spacing', () => {
      const filler = '@';
      const numberOfStrings = 4;
      const spacing = 2;
      const tabBlock = new TabBlock({ filler, numberOfStrings, spacing });
      const strings = Array.from({ length: numberOfStrings }, (_, index) => index + 1);
      const notesToWrite = strings.map((string) => new Note(string, string.toString()));
      const expectedStringSpacingFiller = Array(spacing + 1).join(filler);

      tabBlock.writeParallelNotes(notesToWrite);

      tabBlock.strings.forEach((string, stringIdx) => {
        const expectedStringValue =
          expectedStringSpacingFiller + notesToWrite[stringIdx].fret + expectedStringSpacingFiller;

        expect(string).toBe(expectedStringValue);
      });
    });

    it('should write filler characters on strings without fret instructions and add spacing based on block spacing', () => {
      const filler = '@';
      const numberOfStrings = 4;
      const spacing = 2;
      const tabBlock = new TabBlock({ filler, numberOfStrings, spacing });

      const notesToWrite = [new Note(1, '0'), new Note(2, '0/1')];
      const strings = notesToWrite.map((note) => note.string);

      const expectedStringSpacingFiller = Array(spacing + 1).join(filler);
      const maxNoteFretLength = notesToWrite.reduce(
        (maxNoteFretLength, note) => Math.max(note.fret.length, maxNoteFretLength),
        0
      );

      tabBlock.writeParallelNotes(notesToWrite);

      tabBlock.strings.forEach((string, stringIdx) => {
        if (strings.indexOf(stringIdx + 1) > -1) {
          const stringFretValue = notesToWrite[stringIdx].fret;

          let stringFretLengthCorrectionFiller = '';
          if (stringFretValue.length < maxNoteFretLength) {
            stringFretLengthCorrectionFiller = Array(
              maxNoteFretLength - stringFretValue.length + 1
            ).join(filler);
          }

          const expectedStringValue =
            expectedStringSpacingFiller +
            stringFretValue +
            stringFretLengthCorrectionFiller +
            expectedStringSpacingFiller;

          expect(string).toBe(expectedStringValue);
        } else {
          const stringFretFiller = Array(maxNoteFretLength + 1).join(filler);

          const expectedStringValue =
            expectedStringSpacingFiller + stringFretFiller + expectedStringSpacingFiller;

          expect(string).toBe(expectedStringValue);
        }
      });
    });
  });

  describe('[writeHeader]', () => {
    it('should throw if an empty header is given', () => {
      const tabBlock = new TabBlock();
      const header = '  ';

      expect(() => tabBlock.writeHeader(header)).toThrow();
    });

    it('should write the given header to the header section, preceded by the block section symbol', () => {
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ sectionFiller, sectionSymbol, spacing });
      const header = 'some header';

      const expectedHeader =
        tabBlock.header +
        sectionSymbol +
        sectionFiller +
        header +
        Array(spacing + 1).join(sectionFiller);

      tabBlock.writeHeader(header);

      expect(tabBlock.header).toBe(expectedHeader);
    });

    it(`should write the section symbol to the strings and fill them with filler characters to the header's end`, () => {
      const filler = '@';
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ filler, sectionFiller, sectionSymbol, spacing });
      const header = 'some header';

      const expectedStringsValue = tabBlock.strings.map(
        (string) =>
          string +
          sectionSymbol +
          Array(sectionFiller.length + header.length + spacing + 1).join(filler)
      );

      tabBlock.writeHeader(header);

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it('should keep writing notes on strings based on block spacing despite of the added filler after a header is written', () => {
      const filler = '@';
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ filler, sectionFiller, sectionSymbol, spacing });
      const header = 'some header';
      const noteString = 1;
      const noteFret = '1/2';

      const expectedStringsValue = tabBlock.strings.map((string, stringIdx) => {
        let expectedStringValue;

        if (stringIdx === noteString - 1) {
          expectedStringValue =
            string +
            sectionSymbol +
            Array(spacing + 1).join(filler) +
            noteFret +
            Array(sectionFiller.length + header.length - noteFret.length + 1).join(filler);
        } else {
          expectedStringValue =
            string +
            sectionSymbol +
            Array(sectionFiller.length + header.length + spacing + 1).join(filler);
        }

        return expectedStringValue;
      });

      tabBlock.writeHeader(header).writeNote(new Note(noteString, noteFret));

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it(`should write the section symbol to the footer and fill it with filler characters to the header's end`, () => {
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ sectionFiller, sectionSymbol, spacing });
      const header = 'some header';

      const expectedFooter =
        tabBlock.footer +
        sectionSymbol +
        Array(sectionFiller.length + header.length + spacing + 1).join(sectionFiller);

      tabBlock.writeHeader(header);

      expect(tabBlock.footer).toBe(expectedFooter);
    });
  });

  describe('[writeFooter]', () => {
    it('should throw if an empty footer is given', () => {
      const tabBlock = new TabBlock();
      const footer = '  ';

      expect(() => tabBlock.writeFooter(footer)).toThrow();
    });

    it('should write the given footer to the footer section, preceded by the block section symbol', () => {
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ sectionFiller, sectionSymbol, spacing });
      const footer = 'some footer';

      const expectedFooter =
        tabBlock.footer +
        footer +
        sectionFiller +
        sectionSymbol +
        Array(spacing + 1).join(sectionFiller);

      tabBlock.writeFooter(footer);

      expect(tabBlock.footer).toBe(expectedFooter);
    });

    it(`should fill the strings with filler to the footer's end and write the tab's section symbol and spacing`, () => {
      const filler = '@';
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ filler, sectionFiller, sectionSymbol, spacing });
      const footer = 'some footer';

      const expectedStringsValue = tabBlock.strings.map(
        (string) =>
          string +
          Array(footer.length + sectionFiller.length + 1).join(filler) +
          sectionSymbol +
          Array(spacing + 1).join(filler)
      );

      tabBlock.writeFooter(footer);

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it('should not add filler to the strings if there is already space to add the given footer', () => {
      const filler = '@';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ filler, sectionSymbol, spacing });
      const footer = 'some footer';

      tabBlock.addSpacing(footer.length + 1);

      const expectedStrings = tabBlock.strings.map(
        (string) => string + sectionSymbol + Array(spacing + 1).join(filler)
      );

      tabBlock.writeFooter(footer);

      expect(tabBlock.strings).toEqual(expectedStrings);
    });

    it(`should fill the header with filler to the footer end and add the tab's section symbol and spacing`, () => {
      const sectionFiller = ' ';
      const sectionSymbol = '$';
      const spacing = 2;
      const tabBlock = new TabBlock({ sectionFiller, sectionSymbol, spacing });
      const footer = 'some footer';

      const expectedHeader =
        tabBlock.header +
        Array(footer.length + sectionFiller.length + 1).join(sectionFiller) +
        sectionSymbol +
        Array(spacing + 1).join(sectionFiller);

      tabBlock.writeFooter(footer);

      expect(tabBlock.header).toBe(expectedHeader);
    });
  });
});
