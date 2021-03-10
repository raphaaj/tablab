import { Tab } from '../../src/tab/tab';
import { Note } from '../../src/tab/note';

describe(`[${Tab.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a tab with the default parameters if no configuration is given', () => {
      const tab = new Tab();

      expect(tab.filler).toBe(Tab.DEFAULT_FILLER);
      expect(tab.numberOfRows).toBe(Tab.DEFAULT_NUMBER_OF_ROWS);
      expect(tab.sectionFiller).toBe(Tab.DEFAULT_SECTION_FILLER);
      expect(tab.sectionSymbol).toBe(Tab.DEFAULT_SECTION_SYMBOL);
      expect(tab.spacing).toBe(Tab.DEFAULT_SPACING);
    });

    it('should create a tab with one tab block', () => {
      const tab = new Tab();

      expect(tab.blocks.length).toBe(1);
    });
  });

  describe('[properties]', () => {
    describe('[spacing]', () => {
      it('should synchronize the last tab block spacing with the new tab spacing value', () => {
        const spacing = 5;
        const tab = new Tab();
        const lastTabBlock = tab.blocks[tab.blocks.length - 1];

        tab.spacing = spacing;

        expect(lastTabBlock.spacing).toBe(spacing);
      });
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
      const lastTabBlock = tab.blocks[tab.blocks.length - 1];

      lastTabBlock.addSpacing = jest.fn();
      tab.addSpacing(spacing);

      expect(lastTabBlock.addSpacing).toHaveBeenCalledWith(spacing);
    });
  });

  describe('[format]', () => {
    it('should return the blocks formatted', () => {
      const tab = new Tab();

      const formattedBlocks = tab.blocks.flatMap((block) => block.format());

      expect(tab.format()).toEqual(formattedBlocks);
    });
  });

  describe('[removeSpacing]', () => {
    it('should remove spacing from the last tab block', () => {
      const spacing = 1;
      const tab = new Tab();
      const lastTabBlock = tab.blocks[tab.blocks.length - 1];

      lastTabBlock.removeSpacing = jest.fn();
      tab.removeSpacing(spacing);

      expect(lastTabBlock.removeSpacing).toHaveBeenCalledWith(spacing);
    });
  });

  describe('[writeFooter]', () => {
    it('should write a footer to the last tab block', () => {
      const footer = 'some tab footer';
      const tab = new Tab();
      const lastTabBlock = tab.blocks[tab.blocks.length - 1];

      lastTabBlock.writeFooter = jest.fn();
      tab.writeFooter(footer);

      expect(lastTabBlock.writeFooter).toHaveBeenCalledWith(footer);
    });
  });

  describe('[writeHeader]', () => {
    it('should write a header to the last tab block', () => {
      const header = 'some tab header';
      const tab = new Tab();
      const lastTabBlock = tab.blocks[tab.blocks.length - 1];

      lastTabBlock.writeHeader = jest.fn();
      tab.writeHeader(header);

      expect(lastTabBlock.writeHeader).toHaveBeenCalledWith(header);
    });
  });

  describe('[writeNote]', () => {
    it('should write the given note to the last tab block', () => {
      const note = new Note(1, '0');
      const tab = new Tab();
      const lastTabBlock = tab.blocks[tab.blocks.length - 1];

      lastTabBlock.writeNote = jest.fn();
      tab.writeNote(note);

      expect(lastTabBlock.writeNote).toHaveBeenCalledWith(note);
    });
  });

  describe('[writeParallelNotes]', () => {
    it('should write the given notes in parallel to the last tab block', () => {
      const notes = [new Note(1, '0'), new Note(2, '0')];
      const tab = new Tab();
      const lastTabBlock = tab.blocks[tab.blocks.length - 1];

      lastTabBlock.writeParallelNotes = jest.fn();
      tab.writeParallelNotes(notes);

      expect(lastTabBlock.writeParallelNotes).toHaveBeenCalledWith(notes);
    });
  });
});
