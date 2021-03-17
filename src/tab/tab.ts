import { TabElement, TabElementOptions } from './tab-element';
import { TabBlock } from './tab-block';
import { Note } from './note';

export class Tab extends TabElement {
  readonly blocks: TabElement[];

  private get _currentBlock(): TabElement {
    return this.blocks[this.blocks.length - 1];
  }

  constructor(options?: TabElementOptions) {
    super(options);
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

  addSpacing(spacing?: number): this {
    this._currentBlock.addSpacing(spacing);

    return this;
  }

  format(blockLength: number): string[][] {
    const formattedBlocks = this.blocks.reduce((formattedBlocks, block) => {
      return formattedBlocks.concat(block.format(blockLength));
    }, [] as string[][]);

    return formattedBlocks;
  }

  removeSpacing(spacing?: number | undefined): this {
    this._currentBlock.removeSpacing(spacing);

    return this;
  }

  writeFooter(footer: string): this {
    this._currentBlock.writeFooter(footer);

    return this;
  }

  writeHeader(header: string): this {
    this._currentBlock.writeHeader(header);

    return this;
  }

  writeNote(note: Note): this {
    this._currentBlock.writeNote(note);

    return this;
  }

  writeParallelNotes(notes: Note[]): this {
    this._currentBlock.writeParallelNotes(notes);

    return this;
  }

  protected onSpacingChange(oldValue: number, value: number): void {
    this._currentBlock.spacing = value;
  }
}
