import { Note } from './note';
import { TabBlock } from './tab-block';

export interface TabConfig {
  filler?: string;
  rows?: number;
  sectionFiller?: string;
  sectionSymbol?: string;
  spacing?: number;
}

export class Tab {
  static readonly DEFAULT_FILLER = '-';
  static readonly DEFAULT_ROWS = 6;
  static readonly DEFAULT_SECTION_FILLER = ' ';
  static readonly DEFAULT_SECTION_SYMBOL = '|';
  static readonly DEFAULT_SPACING = 3;

  get blocks(): string[][] {
    return this._blocks.map((tabBlock) => tabBlock.block);
  }

  get filler(): string {
    return this._filler;
  }

  get rows(): number {
    return this._rows;
  }

  get sectionFiller(): string {
    return this._sectionFiller;
  }

  get sectionSymbol(): string {
    return this._sectionSymbol;
  }

  get spacing(): number {
    return this._spacing;
  }
  set spacing(value: number) {
    if (value < 1)
      throw new Error(`The field spacing must be a positive integer. Received value was ${value}.`);

    if (this._blocks.length > 0) {
      const spaceDiff = value - this._spacing;

      if (spaceDiff === 0) return;
      else if (spaceDiff > 0) this._currentBlock.addSpacing(spaceDiff);
      else this._currentBlock.removeSpacing(-spaceDiff);
    }

    this._spacing = value;
  }

  private readonly _blocks: TabBlock[];

  private get _currentBlock(): TabBlock {
    return this._blocks[this._blocks.length - 1];
  }

  private readonly _filler: string;
  private readonly _rows: number;
  private readonly _sectionFiller: string;
  private readonly _sectionSymbol: string;
  private _spacing = Tab.DEFAULT_SPACING;

  constructor({ rows, filler, spacing, sectionSymbol, sectionFiller }: TabConfig = {}) {
    this._blocks = [];

    if (rows === undefined) this._rows = Tab.DEFAULT_ROWS;
    else if (rows < 1)
      throw new Error(`The parameter rows must be a positive integer. Received value was ${rows}.`);
    else this._rows = rows;

    if (!filler) this._filler = Tab.DEFAULT_FILLER;
    else if (filler.length !== 1)
      throw new Error(
        `The parameter filler must be a single character string. Received value was "${filler}"`
      );
    else this._filler = filler;

    if (!sectionSymbol) this._sectionSymbol = Tab.DEFAULT_SECTION_SYMBOL;
    else if (sectionSymbol.length !== 1)
      throw new Error(
        `The parameter sectionSymbol must be a single character string. Received value was "${sectionSymbol}"`
      );
    else this._sectionSymbol = sectionSymbol;

    if (!sectionFiller) this._sectionFiller = Tab.DEFAULT_SECTION_FILLER;
    else if (sectionFiller.length !== 1)
      throw new Error(
        `The parameter sectionFiller must be a single character string. Received value was "${sectionFiller}"`
      );
    else this._sectionFiller = sectionFiller;

    if (spacing === undefined) this.spacing = Tab.DEFAULT_SPACING;
    else this.spacing = spacing;

    this.addBlock();
  }

  addBlock(): Tab {
    this._blocks.push(new TabBlock(this));
    return this;
  }

  addSpacing(spacing?: number | undefined): Tab {
    this._currentBlock.addSpacing(spacing);
    return this;
  }

  isNoteInStringsRange(note: Note): boolean {
    return note.string > 0 && note.string <= this.rows;
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
}
