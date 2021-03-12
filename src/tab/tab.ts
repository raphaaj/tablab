import { TabElement, TabElementConfig } from './tab-element';
import { Note } from './note';
import { TabBlock } from './tab-block';

export class Tab extends TabElement {
  readonly blocks: TabElement[];

  private get _currentBlock(): TabElement {
    return this.blocks[this.blocks.length - 1];
  }

  constructor(tabConfig: TabElementConfig = {}) {
    super(tabConfig);
    this.blocks = [];

    this.addBlock();
  }

  addBlock(): Tab {
    const tabBlock = new TabBlock({
      filler: this.filler,
      numberOfRows: this.numberOfRows,
      sectionFiller: this.sectionFiller,
      sectionSymbol: this.sectionSymbol,
      spacing: this.spacing,
    });

    this.blocks.push(tabBlock);

    return this;
  }

  addSpacing(spacing?: number): Tab {
    this._currentBlock.addSpacing(spacing);

    return this;
  }

  format(blockLength: number): string[][] {
    return this.blocks.flatMap((tabBlock) => tabBlock.format(blockLength));
  }

  removeSpacing(spacing?: number | undefined): Tab {
    this._currentBlock.removeSpacing(spacing);

    return this;
  }

  writeFooter(footer: string): Tab {
    this._currentBlock.writeFooter(footer);

    return this;
  }

  writeHeader(header: string): Tab {
    this._currentBlock.writeHeader(header);

    return this;
  }

  writeNote(note: Note): Tab {
    this._currentBlock.writeNote(note);

    return this;
  }

  writeParallelNotes(notes: Note[]): Tab {
    this._currentBlock.writeParallelNotes(notes);

    return this;
  }

  protected onSpacingChange(oldValue: number, value: number): void {
    this._currentBlock.spacing = value;
  }
}
