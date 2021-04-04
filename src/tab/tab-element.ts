import { Note } from './note';

/**
 * The options to create a tablature element.
 */
export interface TabElementOptions {
  /**
   * The total number of strings used in the tablature element. It must be an integer number
   * greater than 0.
   * @defaultValue {@link TabElement.DEFAULT_NUMBER_OF_STRINGS}
   */
  numberOfStrings?: number;

  /**
   * The character used to mark section divisions in the tablature element. It must be a single
   * character string.
   * @defaultValue {@link TabElement.DEFAULT_SECTION_DIVISION_CHARACTER}
   */
  sectionDivisionCharacter?: string;

  /**
   * The character used to represent spaces between elements in the header and footer sections
   * of the tablature element. It must be a single character string.
   * @defaultValue {@link TabElement.DEFAULT_SECTION_SPACING_CHARACTER}
   */
  sectionSpacingCharacter?: string;

  /**
   * The number of spacing characters to write between notes in the tablature element. It must
   * be an integer number greater than 0.
   * @defaultValue {@link TabElement.DEFAULT_SPACING}
   */
  spacing?: number;

  /**
   * The character used to represent spaces between notes written in the tablature element.
   * It must be a single character string.
   * @defaultValue {@link TabElement.DEFAULT_SPACING_CHARACTER}
   */
  spacingCharacter?: string;
}

export abstract class TabElement {
  static readonly DEFAULT_NUMBER_OF_STRINGS = 6;
  static readonly DEFAULT_SECTION_DIVISION_CHARACTER = '|';
  static readonly DEFAULT_SECTION_SPACING_CHARACTER = ' ';
  static readonly DEFAULT_SPACING = 3;
  static readonly DEFAULT_SPACING_CHARACTER = '-';

  /**
   * The number of spacing characters to write between notes in the tablature element. It must
   * be an integer number greater than 0.
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
   * The total number of strings used in the tablature element.
   */
  readonly numberOfStrings: number;

  /**
   * The character used to mark section divisions in the tablature element.
   */
  readonly sectionDivisionCharacter: string;

  /**
   * The character used to represent spaces between elements in the header and footer sections
   * of the tablature element.
   */
  readonly sectionSpacingCharacter: string;

  /**
   * The character used to represent spaces between notes written in the tablature element.
   */
  readonly spacingCharacter: string;

  private _spacing;

  /**
   * Creates a tablature element.
   * @param options - The options used to create a tablature element.
   */
  constructor(options: TabElementOptions = {}) {
    const {
      numberOfStrings,
      sectionDivisionCharacter,
      sectionSpacingCharacter,
      spacing,
      spacingCharacter,
    } = options;

    if (numberOfStrings === undefined) this.numberOfStrings = TabElement.DEFAULT_NUMBER_OF_STRINGS;
    else if (numberOfStrings < 1)
      throw new Error(
        `The parameter numberOfStrings must be a positive integer. Received value was ${numberOfStrings}.`
      );
    else this.numberOfStrings = numberOfStrings;

    if (!spacingCharacter) this.spacingCharacter = TabElement.DEFAULT_SPACING_CHARACTER;
    else if (spacingCharacter.length !== 1)
      throw new Error(
        `The parameter spacingCharacter must be a single character string. Received value was "${spacingCharacter}"`
      );
    else this.spacingCharacter = spacingCharacter;

    if (!sectionDivisionCharacter)
      this.sectionDivisionCharacter = TabElement.DEFAULT_SECTION_DIVISION_CHARACTER;
    else if (sectionDivisionCharacter.length !== 1)
      throw new Error(
        `The parameter sectionDivisionCharacter must be a single character string. Received value was "${sectionDivisionCharacter}"`
      );
    else this.sectionDivisionCharacter = sectionDivisionCharacter;

    if (!sectionSpacingCharacter)
      this.sectionSpacingCharacter = TabElement.DEFAULT_SECTION_SPACING_CHARACTER;
    else if (sectionSpacingCharacter.length !== 1)
      throw new Error(
        `The parameter sectionSpacingCharacter must be a single character string. Received value was "${sectionSpacingCharacter}"`
      );
    else this.sectionSpacingCharacter = sectionSpacingCharacter;

    if (spacing === undefined) this._spacing = TabElement.DEFAULT_SPACING;
    else if (spacing < 1)
      throw new Error(
        `The parameter spacing must be a positive integer. Received value was ${spacing}.`
      );
    else this._spacing = spacing;
  }

  /**
   * Verifies if a given note is writable to the tablature element. A note is considered to be
   * writable to the tablature element if its string number is in the range `1` - `numberOfStrings`,
   * inclusive.
   * @param note - The note to be verified.
   * @returns `true` if the note is writable, `false` otherwise.
   */
  isNoteWritable(note: Note): boolean {
    return note.string > 0 && note.string <= this.numberOfStrings;
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
   * Creates a spacing string with the given length. All characters are equal to the
   * `sectionSpacingCharacter` character of the tablature element.
   * @param length - The desired length of the spacing string.
   * @returns The created spacing string.
   */
  protected getSectionSpacing(length: number): string {
    return Array(length + 1).join(this.sectionSpacingCharacter);
  }

  /**
   * Creates a spacing string with the given length. All characters are equal to the
   * `spacingCharacter` character of the tablature element.
   * @param length - The desired length of the spacing string.
   * @returns The created spacing string.
   */
  protected getStringsSpacing(length: number): string {
    return Array(length + 1).join(this.spacingCharacter);
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
