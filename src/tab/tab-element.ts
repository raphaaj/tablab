import { Note } from './note';

export interface TabElementConfig {
  filler?: string;
  numberOfRows?: number;
  sectionFiller?: string;
  sectionSymbol?: string;
  spacing?: number;
}

export abstract class TabElement {
  static readonly DEFAULT_FILLER = '-';
  static readonly DEFAULT_NUMBER_OF_ROWS = 6;
  static readonly DEFAULT_SECTION_FILLER = ' ';
  static readonly DEFAULT_SECTION_SYMBOL = '|';
  static readonly DEFAULT_SPACING = 3;

  get spacing(): number {
    return this._spacing;
  }
  set spacing(value: number) {
    if (value < 1)
      throw new Error(`The spacing value must be a positive integer. Received value was ${value}.`);

    this.onSpacingChange(this._spacing, value);
    this._spacing = value;
  }

  readonly filler: string;
  readonly numberOfRows: number;
  readonly sectionFiller: string;
  readonly sectionSymbol: string;

  private _spacing;

  constructor({
    numberOfRows,
    filler,
    spacing,
    sectionSymbol,
    sectionFiller,
  }: TabElementConfig = {}) {
    if (numberOfRows === undefined) this.numberOfRows = TabElement.DEFAULT_NUMBER_OF_ROWS;
    else if (numberOfRows < 1)
      throw new Error(
        `The parameter numberOfRows must be a positive integer. Received value was ${numberOfRows}.`
      );
    else this.numberOfRows = numberOfRows;

    if (!filler) this.filler = TabElement.DEFAULT_FILLER;
    else if (filler.length !== 1)
      throw new Error(
        `The parameter filler must be a single character string. Received value was "${filler}"`
      );
    else this.filler = filler;

    if (!sectionSymbol) this.sectionSymbol = TabElement.DEFAULT_SECTION_SYMBOL;
    else if (sectionSymbol.length !== 1)
      throw new Error(
        `The parameter sectionSymbol must be a single character string. Received value was "${sectionSymbol}"`
      );
    else this.sectionSymbol = sectionSymbol;

    if (!sectionFiller) this.sectionFiller = TabElement.DEFAULT_SECTION_FILLER;
    else if (sectionFiller.length !== 1)
      throw new Error(
        `The parameter sectionFiller must be a single character string. Received value was "${sectionFiller}"`
      );
    else this.sectionFiller = sectionFiller;

    if (spacing === undefined) this._spacing = TabElement.DEFAULT_SPACING;
    else if (spacing < 1)
      throw new Error(
        `The parameter spacing must be a positive integer. Received value was ${spacing}.`
      );
    else this._spacing = spacing;
  }

  isNoteInStringsRange(note: Note): boolean {
    return note.string > 0 && note.string <= this.numberOfRows;
  }

  abstract addSpacing(spacing?: number): TabElement;

  abstract format(targetLength: number): string[][];

  abstract removeSpacing(spacing?: number): TabElement;

  abstract writeFooter(footer: string): TabElement;

  abstract writeHeader(header: string): TabElement;

  abstract writeNote(note: Note): TabElement;

  abstract writeParallelNotes(notes: Note[]): TabElement;

  protected getRowsFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.filler);
  }

  protected getSectionFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.sectionFiller);
  }

  protected abstract onSpacingChange(oldValue: number, value: number): void;
}
