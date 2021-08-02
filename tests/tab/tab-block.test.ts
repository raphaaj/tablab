import { TabBlock } from '../../src/tab/tab-block';
import { Note } from '../../src/tab/note';

describe(`[${TabBlock.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a tab block with the default options if no custom options are given', () => {
      const tabBlock = new TabBlock();

      expect(tabBlock.numberOfStrings).toBe(TabBlock.DEFAULT_NUMBER_OF_STRINGS);
      expect(tabBlock.sectionDivisionCharacter).toBe(TabBlock.DEFAULT_SECTION_DIVISION_CHARACTER);
      expect(tabBlock.sectionSpacingCharacter).toBe(TabBlock.DEFAULT_SECTION_SPACING_CHARACTER);
      expect(tabBlock.spacing).toBe(TabBlock.DEFAULT_SPACING);
      expect(tabBlock.spacingCharacter).toBe(TabBlock.DEFAULT_SPACING_CHARACTER);
    });

    it('should set the numberOfStrings if one is set at instantiation', () => {
      const numberOfStrings = 2;
      const tabBlock = new TabBlock({ numberOfStrings });

      expect(tabBlock.numberOfStrings).toBe(numberOfStrings);
    });

    it('should set the sectionDivisionCharacter if one is set at instantiation', () => {
      const sectionDivisionCharacter = '#';
      const tabBlock = new TabBlock({ sectionDivisionCharacter });

      expect(tabBlock.sectionDivisionCharacter).toBe(sectionDivisionCharacter);
    });

    it('should set the sectionSpacingCharacter if one is set at instantiation', () => {
      const sectionSpacingCharacter = '$';
      const tabBlock = new TabBlock({ sectionSpacingCharacter });

      expect(tabBlock.sectionSpacingCharacter).toBe(sectionSpacingCharacter);
    });

    it('should set the spacing if one is set at instantiation', () => {
      const spacing = 1;
      const tabBlock = new TabBlock({ spacing });

      expect(tabBlock.spacing).toBe(spacing);
    });

    it('should set the spacingCharacter if one is set at instantiation', () => {
      const spacingCharacter = '@';
      const tabBlock = new TabBlock({ spacingCharacter });

      expect(tabBlock.spacingCharacter).toBe(spacingCharacter);
    });

    it('should initialize the block header section', () => {
      const tabBlock = new TabBlock();

      expect(tabBlock.block[0]).toBe('');
    });

    it('should initialize the block strings section', () => {
      const tabBlock = new TabBlock();

      expect.assertions(tabBlock.numberOfStrings);
      tabBlock.block
        .slice(1, tabBlock.numberOfStrings + 1)
        .forEach((string) => expect(string).toBe(''));
    });

    it('should initialize the block footer section', () => {
      const numberOfStrings = 4;

      const tabBlock = new TabBlock();

      expect(tabBlock.block[numberOfStrings + 1]).toBe('');
    });
  });

  describe('[properties]', () => {
    describe('[header]', () => {
      it('should return the block header section', () => {
        const header = 'test header';
        const tabBlock = new TabBlock();

        tabBlock.writeHeader(header);

        expect(tabBlock.header).toBe(tabBlock.block[0]);
      });
    });

    describe('[footer]', () => {
      it('should return the block footer section', () => {
        const footer = 'test footer';
        const tabBlock = new TabBlock();

        tabBlock.writeFooter(footer);

        expect(tabBlock.footer).toBe(tabBlock.block[tabBlock.numberOfStrings + 1]);
      });
    });

    describe('[strings]', () => {
      it('should return the block strings section', () => {
        const numberOfStrings = 4;
        const tabBlock = new TabBlock({ numberOfStrings });

        tabBlock.writeParallelNotes([new Note(1, '1/2'), new Note(4, '1')]);

        expect.assertions(numberOfStrings);
        tabBlock.strings.forEach((string, stringIdx) => {
          expect(string).toBe(tabBlock.block[stringIdx + 1]);
        });
      });
    });
  });

  describe('[addSpacing]', () => {
    it('should throw if the given spacing is not a positive value', () => {
      const tabBlock = new TabBlock();
      const spacingToAdd = 0;

      expect(() => tabBlock.addSpacing(spacingToAdd)).toThrow();
    });

    it('should add spacing characters to all strings with the given spacing length when valid', () => {
      const tabBlock = new TabBlock();
      const spacingToAdd = 10;

      const expectedStringsValue = tabBlock.strings.map(
        (string) => string + Array(spacingToAdd + 1).join(tabBlock.spacingCharacter)
      );

      tabBlock.addSpacing(spacingToAdd);

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it('should add spacing characters to all strings with the block spacing length when no spacing value is given', () => {
      const tabBlock = new TabBlock();

      const expectedStringsValue = tabBlock.strings.map(
        (string) => string + Array(tabBlock.spacing + 1).join(tabBlock.spacingCharacter)
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

    it(`should return 1 block with the given length if the block's length is smaller than the given one (strings)`, () => {
      const numberOfStrings = 2;
      const sectionSpacingCharacter = ' ';
      const spacing = 7;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const blockLength = 20;

      tabBlock.writeNote(new Note(1, '0'));
      const formattedTabBlock = tabBlock.format(blockLength);

      const expectedFormattedBlock = [
        [
          '                    ',
          '-------0------------',
          '--------------------',
          '                    ',
        ],
      ];

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it(`should return 1 block with the given length if the block's length is smaller than the given one (header)`, () => {
      const numberOfStrings = 2;
      const sectionSpacingCharacter = ' ';
      const spacing = 7;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const blockLength = 20;

      tabBlock.writeHeader('test');
      const formattedTabBlock = tabBlock.format(blockLength);

      const expectedFormattedBlock = [
        [
          '       | test       ',
          '-------|------------',
          '-------|------------',
          '       |            ',
        ],
      ];

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it(`should return 1 block with the given length if the block's length is smaller than the given one (footer)`, () => {
      const numberOfStrings = 2;
      const sectionSpacingCharacter = ' ';
      const spacing = 7;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const blockLength = 20;

      tabBlock.writeFooter('test');
      const formattedTabBlock = tabBlock.format(blockLength);

      const expectedFormattedBlock = [
        [
          '            |       ',
          '------------|-------',
          '------------|-------',
          '       test |       ',
        ],
      ];

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in multiple blocks with the given block length if the block length is greater than the given block length', () => {
      const numberOfStrings = 2;
      const sectionSpacingCharacter = ' ';
      const spacing = 15;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const blockLength = 15;

      tabBlock.writeNote(new Note(1, '0'));
      const formattedTabBlock = tabBlock.format(blockLength);

      // prettier-ignore
      const expectedFormattedBlock = [
        [
          '               ',
          '---------------',
          '---------------',
          '               '
        ],
        [
          '               ',
          '-0-------------',
          '---------------',
          '               '
        ],
      ];

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should not split the block in the middle of a header, when possible', () => {
      const numberOfStrings = 2;
      const sectionDivisionCharacter = '|';
      const sectionSpacingCharacter = ' ';
      const spacingBeforeHeader = 10;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionDivisionCharacter,
        sectionSpacingCharacter,
        spacing: spacingBeforeHeader,
        spacingCharacter,
      });
      const header = 'test header';
      const blockLength = 20;

      tabBlock.writeHeader(header);
      const formattedTabBlock = tabBlock.format(blockLength);

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

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should not split the block in the middle of a footer, when possible', () => {
      const numberOfStrings = 2;
      const sectionDivisionCharacter = '|';
      const sectionSpacingCharacter = ' ';
      const spacingBeforeFooter = 10;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionDivisionCharacter,
        sectionSpacingCharacter,
        spacing: spacingBeforeFooter,
        spacingCharacter,
      });
      const footer = 'test footer';
      const blockLength = 20;

      tabBlock.writeFooter(footer);
      const formattedTabBlock = tabBlock.format(blockLength);

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

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should not split the block in the middle of a string fret instruction, when possible', () => {
      const spacingCharacter = '-';
      const numberOfStrings = 2;
      const spacingBeforeNote = 15;
      const sectionSpacingCharacter = ' ';
      const sectionDivisionCharacter = '|';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionDivisionCharacter,
        sectionSpacingCharacter,
        spacing: spacingBeforeNote,
        spacingCharacter,
      });
      const blockLength = 20;

      tabBlock.writeNote(new Note(1, '0h2p0'));
      const formattedTabBlock = tabBlock.format(blockLength);

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

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in the middle of a header when unable to split it without breaking the header', () => {
      const numberOfStrings = 2;
      const sectionDivisionCharacter = '|';
      const sectionSpacingCharacter = ' ';
      const spacing = 1;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionDivisionCharacter,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const header = 'a long enough header';
      const blockLength = 20;

      tabBlock.writeHeader(header);
      const formattedTabBlock = tabBlock.format(blockLength);

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

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in the middle of a footer when unable to split it without breaking the footer', () => {
      const numberOfStrings = 2;
      const sectionDivisionCharacter = '|';
      const sectionSpacingCharacter = ' ';
      const spacing = 1;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionDivisionCharacter,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const footer = 'a long enough footer';
      const blockLength = 20;

      tabBlock.writeFooter(footer);
      const formattedTabBlock = tabBlock.format(blockLength);

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

      expect(formattedTabBlock).toEqual(expectedFormattedBlock);
    });

    it('should split the block in the middle of a string fret instruction when unable to split it without breaking the instruction', () => {
      const numberOfStrings = 2;
      const sectionDivisionCharacter = '|';
      const sectionSpacingCharacter = ' ';
      const spacing = 1;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({
        numberOfStrings,
        sectionDivisionCharacter,
        sectionSpacingCharacter,
        spacing,
        spacingCharacter,
      });
      const blockLength = 20;

      tabBlock.writeNote(new Note(1, 'a_long_enough_instruction'));
      const formattedTabBlock = tabBlock.format(blockLength);

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
      const tabBlock = new TabBlock();
      const spacingToRemove = 1;

      expect(() => tabBlock.removeSpacing(spacingToRemove)).toThrow();
    });

    it('should remove spacing characters from all strings by the given spacing length when valid', () => {
      const tabBlock = new TabBlock();
      const spacingToRemove = 1;

      tabBlock.addSpacing(2);

      const expectedStringsValue = tabBlock.strings.map((string) =>
        string.slice(0, string.length - spacingToRemove)
      );

      tabBlock.removeSpacing(spacingToRemove);

      expect(tabBlock.strings).toEqual(expectedStringsValue);
    });

    it('should remove spacing characters from all strings by the maximum removable spacing length when no spacing value is given', () => {
      const spacing = 2;
      const tabBlock = new TabBlock({ spacing });

      tabBlock.addSpacing(spacing);

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
    it('should return the strings length if they are filled with spacing characters only', () => {
      const tabBlock = new TabBlock();
      const spacingToAdd = 2;

      tabBlock.addSpacing(spacingToAdd);
      const stringsLength = tabBlock.strings[0].length;

      const maximumRemovableSpacing = tabBlock.getMaximumRemovableSpacing();

      expect(maximumRemovableSpacing).toBe(stringsLength);
    });

    it('should return the maximum number of sequential spacing characters from all strings backwards', () => {
      const tabBlock = new TabBlock();
      const spacingToAdd = 2;

      tabBlock.writeNote(new Note(1, '0'));
      tabBlock.addSpacing(spacingToAdd);

      const maximumRemovableSpacing = tabBlock.getMaximumRemovableSpacing();

      expect(maximumRemovableSpacing).toBe(spacingToAdd);
    });
  });

  describe('[writeParallelNotes]', () => {
    it(`should throw if any of the given notes have a string value smaller than 1`, () => {
      const tabBlock = new TabBlock();
      const noteToWrite = new Note(0, '1/2');

      expect(() => tabBlock.writeParallelNotes([noteToWrite])).toThrow();
    });

    it(`should throw if any of the given notes have a string value greater than the block strings number`, () => {
      const tabBlock = new TabBlock();
      const noteToWrite = new Note(tabBlock.numberOfStrings + 1, '1/2');

      expect(() => tabBlock.writeParallelNotes([noteToWrite])).toThrow();
    });

    it('should throw if any set of the given notes, shares the same string value', () => {
      const tabBlock = new TabBlock();
      const sharedString = 1;
      const fretInstructions = ['1/2', '2/1'];

      const notesToWrite = fretInstructions.map((fret) => new Note(sharedString, fret));

      expect(() => tabBlock.writeParallelNotes(notesToWrite)).toThrow();
    });

    it('should add spacing based on block spacing and write, in parallel, the fret instructions on the specified strings', () => {
      const numberOfStrings = 3;
      const spacing = 2;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({ numberOfStrings, spacing, spacingCharacter });

      const notesToWrite = [new Note(1, '1'), new Note(2, '2'), new Note(3, '3')];
      tabBlock.writeParallelNotes(notesToWrite);

      // prettier-ignore
      const expectedStrings = [
        '--1',
        '--2',
        '--3',
      ];

      expect(tabBlock.strings).toEqual(expectedStrings);
    });

    it('should add spacing based on block spacing and write spacing characters on strings without fret instructions', () => {
      const numberOfStrings = 3;
      const spacing = 2;
      const spacingCharacter = '-';
      const tabBlock = new TabBlock({ spacingCharacter, numberOfStrings, spacing });

      const notesToWrite = [new Note(1, '1'), new Note(3, '1/2')];
      tabBlock.writeParallelNotes(notesToWrite);

      // prettier-ignore
      const expectedStrings = [
        '--1--',
        '-----',
        '--1/2',
      ];

      expect(tabBlock.strings).toEqual(expectedStrings);
    });
  });

  describe('[writeHeader]', () => {
    it('should throw if an empty header is given', () => {
      const tabBlock = new TabBlock();
      const header = '  ';

      expect(() => tabBlock.writeHeader(header)).toThrow();
    });

    it('should write the given header to the header section preceded by the section division character', () => {
      const numberOfStrings = 2;
      const spacing = 2;
      const spacingCharacter = '-';
      const sectionSpacingCharacter = ' ';
      const sectionDivisionCharacter = '$';
      const tabBlock = new TabBlock({
        numberOfStrings,
        spacing,
        spacingCharacter,
        sectionSpacingCharacter,
        sectionDivisionCharacter,
      });

      tabBlock.writeHeader('some header');

      const expectedBlock = [
        '  $ some header',
        '--$------------',
        '--$------------',
        '  $            ',
      ];

      expect(tabBlock.block).toEqual(expectedBlock);
    });

    it('should keep writing notes on strings based on block spacing despite of the added spacing after a header is written', () => {
      const numberOfStrings = 2;
      const spacing = 2;
      const spacingCharacter = '-';
      const sectionSpacingCharacter = ' ';
      const sectionDivisionCharacter = '$';
      const tabBlock = new TabBlock({
        numberOfStrings,
        spacing,
        spacingCharacter,
        sectionSpacingCharacter,
        sectionDivisionCharacter,
      });

      tabBlock.writeHeader('some header').writeNote(new Note(2, '1/3'));

      const expectedBlock = [
        '  $ some header',
        '--$------------',
        '--$--1/3-------',
        '  $            ',
      ];

      expect(tabBlock.block).toEqual(expectedBlock);
    });
  });

  describe('[writeFooter]', () => {
    it('should throw if an empty footer is given', () => {
      const tabBlock = new TabBlock();
      const footer = '  ';

      expect(() => tabBlock.writeFooter(footer)).toThrow();
    });

    it('should write the given footer to the footer section followed by the section division character', () => {
      const numberOfStrings = 2;
      const spacing = 2;
      const spacingCharacter = '-';
      const sectionSpacingCharacter = ' ';
      const sectionDivisionCharacter = '$';
      const tabBlock = new TabBlock({
        numberOfStrings,
        spacing,
        spacingCharacter,
        sectionSpacingCharacter,
        sectionDivisionCharacter,
      });

      tabBlock.writeFooter('some footer');

      const expectedBlock = [
        '              $',
        '--------------$',
        '--------------$',
        '  some footer $',
      ];

      expect(tabBlock.block).toEqual(expectedBlock);
    });

    it(`should use the previous spacing to insert the given footer when there is spacing available for it`, () => {
      const numberOfStrings = 2;
      const spacing = 2;
      const spacingCharacter = '-';
      const sectionSpacingCharacter = ' ';
      const sectionDivisionCharacter = '$';
      const tabBlock = new TabBlock({
        numberOfStrings,
        spacing,
        spacingCharacter,
        sectionSpacingCharacter,
        sectionDivisionCharacter,
      });

      tabBlock.writeHeader('A long enough header').writeFooter('A short footer');

      const expectedBlock = [
        '  $ A long enough header  $',
        '--$-----------------------$',
        '--$-----------------------$',
        '  $        A short footer $',
      ];

      expect(tabBlock.block).toEqual(expectedBlock);
    });
  });
});
