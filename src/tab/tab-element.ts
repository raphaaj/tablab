import { Note } from './note';

/**
 * The options to create a tablature element.
 */
export interface TabElementOptions {
  /**
   * The character used to represent spaces between notes written in the tablature element.
   * It must be a single character string.
   * @defaultValue {@link TabElement.DEFAULT_FILLER}
   */
  filler?: string;

  /**
   * The total number of strings used in the tablature element. It must be an integer number
   * greater than 0.
   * @defaultValue {@link TabElement.DEFAULT_NUMBER_OF_ROWS}
   */
  numberOfRows?: number;

  /**
   * The character used to represent spaces between elements in the header and footer sections
   * of the tablature element. It must be a single character string.
   * @defaultValue {@link TabElement.DEFAULT_SECTION_FILLER}
   */
  sectionFiller?: string;

  /**
   * The character used to mark section divisions in the tablature element. It must be a single
   * character string.
   * @defaultValue {@link TabElement.DEFAULT_SECTION_SYMBOL}
   */
  sectionSymbol?: string;

  /**
   * The number of filler characters to write as spacing between notes written in the tablature
   * element. It must be an integer number greater than 0.
   * @defaultValue {@link TabElement.DEFAULT_SPACING}
   */
  spacing?: number;
}

export abstract class TabElement {
  static readonly DEFAULT_FILLER = '-';
  static readonly DEFAULT_NUMBER_OF_ROWS = 6;
  static readonly DEFAULT_SECTION_FILLER = ' ';
  static readonly DEFAULT_SECTION_SYMBOL = '|';
  static readonly DEFAULT_SPACING = 3;

  /**
   * The number of filler characters to write as spacing between notes written in the tablature
   * element. It must be an integer number greater than 0.
   */
  get spacing(): number {
    return this._spacing;
  }
  set spacing(value: number) {
    if (value < 1)
      throw new Error(`The spacing value must be a positive integer. Received value was ${value}.`);

    this.onSpacingChange(this._spacing, value);
    this._spacing = value;
  }

  /**
   * The character used to represent spaces between notes written in the tablature element.
   */
  readonly filler: string;

  /**
   * The total number of strings used in the tablature element.
   */
  readonly numberOfRows: number;

  /**
   * The character used to represent spaces between elements in the header and footer sections
   * of the tablature element.
   */
  readonly sectionFiller: string;

  /**
   * The character used to mark section divisions in the tablature element.
   */
  readonly sectionSymbol: string;

  private _spacing;

  /**
   * Creates a tablature element.
   * @param options - The options used to create a tablature element.
   */
  constructor(options: TabElementOptions = {}) {
    const { numberOfRows, filler, spacing, sectionSymbol, sectionFiller } = options;

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

  /**
   * Verifies if the string of a given note is in the range of strings of the tablature element.
   * If it is in the range `1` - `numberOfRows`, inclusive, then the note is considered inside
   * the tablature element strings range.
   * @param note - The note to be verified.
   * @returns `true` if the note is in the tablature element strings range, `false` otherwise.
   */
  isNoteInStringsRange(note: Note): boolean {
    return note.string > 0 && note.string <= this.numberOfRows;
  }

  /**
   * Sets the spacing between notes of the tablature element.
   *
   * @param spacing - The new spacing value.
   * @returns The tablature element.
   *
   * @see {@link TabElement.spacing}
   */
  setSpacing(spacing: number): this {
    this.spacing = spacing;

    return this;
  }

  abstract addSpacing(spacing?: number): this;

  abstract format(targetLength: number): string[][];

  abstract removeSpacing(spacing?: number): this;

  abstract writeFooter(footer: string): this;

  abstract writeHeader(header: string): this;

  abstract writeNote(note: Note): this;

  abstract writeParallelNotes(notes: Note[]): this;

  /**
   * Creates a filler string with the given length. All characters are equal to the
   * `filler` character of the tablature element.
   * @param fillerLength - The desired length of the filler string.
   * @returns The created filler string.
   */
  protected getRowsFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.filler);
  }

  /**
   * Creates a filler string with the given length. All characters are equal to the
   * `sectionFiller` character of the tablature element.
   * @param fillerLength - The desired length of the filler string.
   * @returns The created filler string.
   */
  protected getSectionFiller(fillerLength: number): string {
    return Array(fillerLength + 1).join(this.sectionFiller);
  }

  /**
   * Method called when the `spacing` of the tablature element changes. The method
   * call happens after all validations and before updating the spacing value.
   * @param oldValue - The old spacing value.
   * @param value - The new spacing value.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected onSpacingChange(oldValue: number, value: number): void {
    return;
  }
}
