import { TabElement, TabElementOptions } from './tab-element';
import { StringHelper } from '../helpers/string-helper';
import { Note } from './note';

type FooterInsertPreparationResult = {
  footerInsertionStartIdx: number;
  footerToInsert: string;
  spacingToAdd: number;
};

type BlockSplitResult = {
  left: string[];
  right?: string[];
};

export class TabBlock extends TabElement {
  static readonly MINIMUM_BLOCK_END_SPACING_LENGTH = 1;
  static readonly MINIMUM_BLOCK_LENGTH = 15;

  /**
   * The non-formatted tablature block representation.
   */
  get block(): string[] {
    if (!this._isBlockSet) this._setupInternalBlock();
    return this._block;
  }

  /**
   * The non-formatted header section of the tablature block representation.
   */
  get header(): string {
    return this._getBlockHeader(this.block);
  }

  /**
   * The non-formatted footer section of the tablature block representation.
   */
  get footer(): string {
    return this._getBlockFooter(this.block);
  }

  /**
   * The non-formatted strings section of the tablature block representation.
   */
  get strings(): string[] {
    return this._getBlockStrings(this.block);
  }

  private _block: string[];
  private _blockFooterIdx: number;
  private _blockHeaderIdx: number;
  private _blockStringsEndIdx: number;
  private _blockStringsStartIdx: number;
  private _footer: string;
  private _header: string;
  private _isBlockSet: boolean;
  private _strings: string[];
  private get _stringsLength(): number {
    return this._strings[0].length;
  }

  /**
   * Creates a tablature block.
   * @param options - The options used to create a tablature block.
   */
  constructor(options?: TabElementOptions) {
    super(options);

    this._blockFooterIdx = this.numberOfStrings + 1;
    this._blockHeaderIdx = 0;
    this._blockStringsStartIdx = this._blockHeaderIdx + 1;
    this._blockStringsEndIdx = this._blockFooterIdx - 1;

    this._footer = '';
    this._header = '';
    this._strings = Array(this.numberOfStrings).fill('');

    this._block = [];
    this._isBlockSet = false;
  }

  /**
   * Adds spacing characters in the tablature block. It uses the `spacingCharacter` character
   * as a spacing character for the strings section and the `sectionSpacingCharacter` character
   * as a spacing character for the header and footer sections.
   * @param spacing - The number of spacing characters to add. If omitted, the
   * current `spacing` value of the tablature block will be used.
   * @returns The tablature block.
   */
  addSpacing(spacing?: number): this {
    const spacingToAdd = spacing ?? this.spacing;

    if (spacingToAdd < 1)
      throw new Error(
        `The parameter spacing must be a positive integer. Received value was ${spacing}.`
      );

    const stringsSpacing = this.getStringsSpacing(spacingToAdd);

    this._strings.forEach(
      (string, stringIdx) => (this._strings[stringIdx] = string + stringsSpacing)
    );

    this._isBlockSet = false;

    return this;
  }

  /**
   * Formats the tablature block representation with the given block length. The
   * block representation will be divided into multiple blocks so that every block
   * has the specified block length. The minimum block length is 15.
   * @param blockLength - The length expected for each formatted tablature block.
   * @returns The formatted tablature block.
   */
  format(blockLength: number): string[][] {
    if (blockLength < TabBlock.MINIMUM_BLOCK_LENGTH)
      throw new Error(
        `The block length must be at least ${TabBlock.MINIMUM_BLOCK_LENGTH}.` +
          ` Received values was ${blockLength}.`
      );

    let blockToFormat: string[] | undefined = [...this.block];

    const formattedBlock: string[][] = [];
    while (blockToFormat) {
      const blockTargetLength = blockLength - TabBlock.MINIMUM_BLOCK_END_SPACING_LENGTH;
      const blockSplitIndex = this._getBlockSplitIndexForTargetLength(
        blockToFormat,
        blockTargetLength
      );

      const blockSplitResult = this._splitBlockAtIndex(blockToFormat, blockSplitIndex);
      formattedBlock.push(this._fillBlockToTargetLength(blockSplitResult.left, blockLength));

      blockToFormat = blockSplitResult.right;
    }

    return formattedBlock;
  }

  /**
   * Returns the maximum number of spacing characters that can be removed from the
   * tablature block.
   * @returns The maximum removable number of spacing characters.
   */
  getMaximumRemovableSpacing(): number {
    return this._strings.reduce((maxRemovableSpacing, string) => {
      const nonSpacingLastIdx = StringHelper.getIndexOfDifferent(
        string,
        this.spacingCharacter,
        string.length - 1,
        -1
      );

      const removableSpacing =
        nonSpacingLastIdx < 0 ? string.length : string.length - (nonSpacingLastIdx + 1);

      return maxRemovableSpacing < 0
        ? removableSpacing
        : Math.min(removableSpacing, maxRemovableSpacing);
    }, -1);
  }

  /**
   * Removes spacing characters from the tablature block. It considers the `spacingCharacter`
   * character as a spacing character for the strings section and the `sectionSpacingCharacter`
   * character as a spacing character for the header and footer sections.
   * @param spacing - The number of spacing characters to remove. It must be an
   * integer number greater than 0 and smaller than the maximum removable spacing.
   * If omitted, the maximum removable spacing will be used.
   * @returns The tablature block.
   *
   * @see {@link TabBlock.getMaximumRemovableSpacing}
   */
  removeSpacing(spacing?: number | undefined): this {
    const maxRemovableSpacing = this.getMaximumRemovableSpacing();
    const spacingToRemove = spacing ?? maxRemovableSpacing;

    if (spacingToRemove < 1)
      throw new Error(
        `The parameter spacing must be a positive integer. Received value was ${spacing}.`
      );
    if (spacingToRemove > maxRemovableSpacing)
      throw new Error(
        'The spacing indicated for removal exceeds the maximum removable spacing of ' +
          `${maxRemovableSpacing} characters. Received value was ${spacingToRemove}.`
      );

    this._strings.forEach(
      (string, stringIdx) =>
        (this._strings[stringIdx] = string.slice(0, string.length - spacingToRemove))
    );

    this._isBlockSet = false;

    return this;
  }

  /**
   * Writes a footer in the footer section of the tablature block.
   * @param footer - The footer to be written. It must be a non-empty string.
   * @returns The tablature block.
   */
  writeFooter(footer: string): this {
    if (footer.trim().length === 0) throw new Error('A footer must not be blank');

    this._setupForNewSection();

    const {
      footerToInsert,
      footerInsertionStartIdx,
      spacingToAdd,
    } = this._getFooterInsertPreparation(footer);

    if (spacingToAdd > 0) {
      this._header += this.getSectionSpacing(spacingToAdd);
      this.addSpacing(spacingToAdd);
    }

    this._header += this.sectionDivisionCharacter;

    this._strings.forEach(
      (string, stringIdx) => (this._strings[stringIdx] = string + this.sectionDivisionCharacter)
    );

    this._footer =
      this._footer.slice(0, footerInsertionStartIdx) +
      footerToInsert +
      this.sectionDivisionCharacter;

    this._isBlockSet = false;

    return this;
  }

  /**
   * Writes a header in the header section of the tablature block.
   * @param header - The header to be written. It must be a non-empty string.
   * @returns The tablature block.
   */
  writeHeader(header: string): this {
    if (header.trim().length === 0) throw new Error('A header must not be blank');

    this._setupForNewSection();

    this._header += this.sectionDivisionCharacter + this.getSectionSpacing(1) + header;

    this._strings.forEach(
      (string, stringIdx) => (this._strings[stringIdx] = string + this.sectionDivisionCharacter)
    );

    this._footer += this.sectionDivisionCharacter;

    this._isBlockSet = false;

    return this;
  }

  /**
   * Writes a note in the current tablature block. The string of the note
   * must be in the tablature block strings range.
   * @param note - The note to be written.
   * @returns The tablature block.
   */
  writeNote(note: Note): this {
    return this.writeParallelNotes([note]);
  }

  /**
   * Writes multiple notes in the tablature block. The notes will be written
   * in parallel, i.e., in the same tablature time. The string of all notes
   * must be in the tablature strings range, and there must be no set of notes
   * sharing the same string value.
   * @param notes - The notes to be written in parallel.
   * @returns The tablature block.
   */
  writeParallelNotes(notes: Note[]): this {
    const stringsOutOfRange = this._getStringsOutOfRangeOnNotes(notes);
    if (stringsOutOfRange.length > 0)
      throw new Error(
        `The strings ${stringsOutOfRange.join(', ')} are out of tab strings range. ` +
          `Strings must be between 1 and ${this.numberOfStrings}`
      );

    const stringsWithConcurrentNotes = this._getStringsWithConcurrentNotes(notes);
    if (stringsWithConcurrentNotes.length > 0) {
      throw new Error(
        `Multiple notes applied to the tab strings ${stringsWithConcurrentNotes.join(', ')}`
      );
    }

    this.addSpacing();
    this._writeInstructionsToStrings(notes);

    return this;
  }

  private _fillBlockToTargetLength(block: string[], blockTargetLength: number): string[] {
    const header = this._getBlockHeader(block);
    const footer = this._getBlockFooter(block);
    const strings = this._getBlockStrings(block);

    const formattedHeader = header + this.getSectionSpacing(blockTargetLength - header.length);
    const formattedFooter = footer + this.getSectionSpacing(blockTargetLength - footer.length);
    const formattedStrings = strings.map(
      (string) => string + this.getStringsSpacing(blockTargetLength - string.length)
    );

    return [formattedHeader, ...formattedStrings, formattedFooter];
  }

  private _getBlockFooter(block: string[]): string {
    return block[this._blockFooterIdx];
  }

  private _getBlockHeader(block: string[]): string {
    return block[this._blockHeaderIdx];
  }

  private _getBlockLength(block: string[]): number {
    return block[0].length;
  }

  private _getBlockSplitIndexForTargetLength(block: string[], targetBlockLength: number): number {
    const blockLength = this._getBlockLength(block);

    let splitIndex = null;
    if (blockLength <= targetBlockLength) {
      splitIndex = blockLength - 1;
    } else {
      const initialSplitIndex = targetBlockLength - 1;

      splitIndex = initialSplitIndex;
      while (splitIndex > 0 && !this._isBlockSplittableAtIndex(block, splitIndex)) {
        splitIndex--;
      }

      if (splitIndex === 0) splitIndex = initialSplitIndex;
    }

    return splitIndex;
  }

  private _getBlockStrings(block: string[]): string[] {
    return block.slice(this._blockStringsStartIdx, this._blockStringsEndIdx + 1);
  }

  private _getFooterInsertPreparation(footer: string): FooterInsertPreparationResult {
    const footerToInsert =
      this.getSectionSpacing(this.spacing) + footer + this.getSectionSpacing(1);

    const nonSectionSpacingFooterIdx = StringHelper.getIndexOfDifferent(
      this._footer,
      this.sectionSpacingCharacter,
      -1,
      -1
    );

    let footerInsertionStartIdx = nonSectionSpacingFooterIdx + 1;
    let spacingToAdd = 0;
    if (footerInsertionStartIdx + footerToInsert.length <= this._stringsLength) {
      footerInsertionStartIdx = this._stringsLength - footerToInsert.length;
    } else {
      spacingToAdd = footerInsertionStartIdx + footerToInsert.length - this._stringsLength;
    }

    return {
      footerToInsert,
      footerInsertionStartIdx,
      spacingToAdd,
    };
  }

  private _getMinimumFooterLength(): number {
    return this._getMinimumSectionLength(this._footer);
  }

  private _getMinimumHeaderLength(): number {
    return this._getMinimumSectionLength(this._header);
  }

  private _getMinimumSectionLength(section: string): number {
    const nonSectionSpacingIdx = StringHelper.getIndexOfDifferent(
      section,
      this.sectionSpacingCharacter,
      -1,
      -1
    );

    const minimumSectionLenth = nonSectionSpacingIdx > -1 ? nonSectionSpacingIdx + 1 : 0;

    return minimumSectionLenth;
  }

  private _getStringsOutOfRangeOnNotes(notes: Note[]): number[] {
    return this._getUniqueStringsFromNotes(notes.filter((note) => !this.isNoteWritable(note)));
  }

  private _getStringsWithConcurrentNotes(notes: Note[]): number[] {
    const string2NotesCountMap = notes.reduce((store, note) => {
      store[note.string] ? store[note.string]++ : (store[note.string] = 1);
      return store;
    }, {} as Record<number, number>);

    const concurrentNotes = Object.keys(string2NotesCountMap)
      .map((stringStr) => Number(stringStr))
      .filter((string) => string2NotesCountMap[string] > 1)
      .reduce((concurrentNotes, string) => {
        return concurrentNotes.concat(notes.filter((note) => note.string === string));
      }, [] as Note[]);

    return this._getUniqueStringsFromNotes(concurrentNotes);
  }

  private _getUniqueStringsFromNotes(notes: Note[]): number[] {
    return notes
      .map((note) => note.string)
      .filter((string, index, strings) => strings.indexOf(string) === index);
  }

  private _isBlockFooterSplittableAtIndex(block: string[], splitIndex: number): boolean {
    const footer = this._getBlockFooter(block);

    return this._isBlockSectionSplittableAtIndex(footer, splitIndex);
  }

  private _isBlockHeaderSplittableAtIndex(block: string[], splitIndex: number): boolean {
    const header = this._getBlockHeader(block);

    return this._isBlockSectionSplittableAtIndex(header, splitIndex);
  }

  private _isBlockSectionSplittableAtIndex(section: string, splitIndex: number): boolean {
    const thisCharacter = section[splitIndex];
    const nextCharacter = section[splitIndex + 1];

    return (
      thisCharacter === this.sectionSpacingCharacter &&
      (nextCharacter === this.sectionSpacingCharacter || nextCharacter === undefined)
    );
  }

  private _isBlockSplittableAtIndex(block: string[], splitIndex: number): boolean {
    return (
      this._isBlockHeaderSplittableAtIndex(block, splitIndex) &&
      this._isBlockStringsSplittableAtIndex(block, splitIndex) &&
      this._isBlockFooterSplittableAtIndex(block, splitIndex)
    );
  }

  private _isBlockStringsSplittableAtIndex(block: string[], splitIndex: number): boolean {
    const strings = this._getBlockStrings(block);

    const stringsSplittableAtIndex = strings.reduce((stringsSplittableAtIndex, string) => {
      const nextCharacter = string[splitIndex + 1];
      return (
        stringsSplittableAtIndex &&
        (nextCharacter === this.spacingCharacter || nextCharacter === undefined)
      );
    }, true);

    return stringsSplittableAtIndex;
  }

  private _setupForNewSection(): void {
    this._header = this._getBlockHeader(this.block);
    this._footer = this._getBlockFooter(this.block);
    this._strings = this._getBlockStrings(this.block);

    const sectionSpacing = this.getSectionSpacing(this.spacing);
    this._header += sectionSpacing;
    this._footer += sectionSpacing;

    this.addSpacing();
  }

  private _setupInternalBlock(): void {
    const endBlockLength = Math.max(
      this._stringsLength,
      this._getMinimumHeaderLength(),
      this._getMinimumFooterLength()
    );

    const header =
      this._header.length < endBlockLength
        ? this._header + this.getSectionSpacing(endBlockLength - this._header.length)
        : this._header.slice(0, endBlockLength);

    const footer =
      this._footer.length < endBlockLength
        ? this._footer + this.getSectionSpacing(endBlockLength - this._footer.length)
        : this._footer.slice(0, endBlockLength);

    const strings = this._strings.map((string) =>
      string.length < endBlockLength
        ? string + this.getStringsSpacing(endBlockLength - string.length)
        : string
    );

    this._block = [header, ...strings, footer];
    this._isBlockSet = true;
  }

  private _splitBlockAtIndex(block: string[], splitIndex: number): BlockSplitResult {
    const blockLength = this._getBlockLength(block);
    const header = this._getBlockHeader(block);
    const footer = this._getBlockFooter(block);
    const strings = this._getBlockStrings(block);

    const leftSplit = [
      header.slice(0, splitIndex + 1),
      ...strings.map((string) => string.slice(0, splitIndex + 1)),
      footer.slice(0, splitIndex + 1),
    ];

    let rightSplit;
    if (splitIndex + 1 < blockLength) {
      rightSplit = [
        header.slice(splitIndex + 1),
        ...strings.map((string) => string.slice(splitIndex + 1)),
        footer.slice(splitIndex + 1),
      ];
    }

    return {
      left: leftSplit,
      right: rightSplit,
    };
  }

  private _writeInstructionsToStrings(notes: Note[]): void {
    const maxInstructionLength = notes.reduce((maxNoteLength: number, note) => {
      return Math.max(maxNoteLength, note.fret.length);
    }, 0);

    this._strings.forEach((string, stringIdx) => {
      const noteToWrite = notes.find((note) => note.string === stringIdx + 1);
      if (noteToWrite) {
        const stringSpacingLength = maxInstructionLength - noteToWrite.fret.length;
        this._strings[stringIdx] =
          string + noteToWrite.fret + this.getStringsSpacing(stringSpacingLength);
      } else {
        this._strings[stringIdx] = string + this.getStringsSpacing(maxInstructionLength);
      }
    });

    this._isBlockSet = false;
  }
}
