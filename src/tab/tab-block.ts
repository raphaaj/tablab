import { TabElement, TabElementOptions } from './tab-element';
import { StringHelper } from '../helpers/string-helper';
import { Note } from './note';

type FooterInsertPreparation = {
  fillersToAdd: number;
  footerInsertStartIdx: number;
  footerToAdd: string;
};

type BlockSplitResult = {
  left: string[];
  right?: string[];
};

export class TabBlock extends TabElement {
  static readonly MINIMUM_BLOCK_END_FILLER_LENGTH = 1;
  static readonly MINIMUM_BLOCK_LENGTH = 15;

  get block(): string[] {
    if (!this._isBlockSet) this._setupInternalBlock();
    return this._block;
  }

  get header(): string {
    return this._getBlockHeader(this.block);
  }

  get footer(): string {
    return this._getBlockFooter(this.block);
  }

  get rows(): string[] {
    return this._getBlockRows(this.block);
  }

  private _block: string[];
  private _blockFooterIdx: number;
  private _blockHeaderIdx: number;
  private _blockRowsEndIdx: number;
  private _blockRowsStartIdx: number;
  private _footer: string;
  private _header: string;
  private _isBlockSet: boolean;
  private _rows: string[];
  private get _rowsLength(): number {
    return this._rows[0].length;
  }

  constructor(options?: TabElementOptions) {
    super(options);

    this._blockFooterIdx = this.numberOfRows + 1;
    this._blockHeaderIdx = 0;
    this._blockRowsStartIdx = this._blockHeaderIdx + 1;
    this._blockRowsEndIdx = this._blockFooterIdx - 1;

    this._footer = '';
    this._header = '';
    this._rows = Array(this.numberOfRows).fill('');

    this._block = [];
    this._isBlockSet = false;

    this.addSpacing();
  }

  addSpacing(spacing?: number): TabBlock {
    const spacingToAdd = spacing ?? this.spacing;

    if (spacingToAdd < 1)
      throw new Error(
        `The parameter spacing must be a positive integer. Received value was ${spacing}.`
      );

    const rowFiller = this.getRowsFiller(spacingToAdd);
    this._rows.forEach((row, rowIdx) => (this._rows[rowIdx] = row + rowFiller));

    this._isBlockSet = false;

    return this;
  }

  format(blockLength: number): string[][] {
    if (blockLength < TabBlock.MINIMUM_BLOCK_LENGTH)
      throw new Error(
        `The block length must be at least ${TabBlock.MINIMUM_BLOCK_LENGTH}.` +
          ` Received values was ${blockLength}.`
      );

    let blockToFormat: string[] | undefined = [...this.block];

    const formattedBlock: string[][] = [];
    while (blockToFormat) {
      const blockTargetLength = blockLength - TabBlock.MINIMUM_BLOCK_END_FILLER_LENGTH;
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

  getMaximumRemovableSpacing(): number {
    return this._rows.reduce((maxRemovableSpacing, row) => {
      const nonFillerLastIdx = StringHelper.getIndexOfDifferent(
        row,
        this.filler,
        row.length - 1,
        -1
      );

      const removableSpacing =
        nonFillerLastIdx < 0 ? row.length : row.length - (nonFillerLastIdx + 1);

      return maxRemovableSpacing < 0
        ? removableSpacing
        : Math.min(removableSpacing, maxRemovableSpacing);
    }, -1);
  }

  removeSpacing(spacing?: number | undefined): TabBlock {
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

    this._rows.forEach(
      (row, rowIdx) => (this._rows[rowIdx] = row.slice(0, row.length - spacingToRemove))
    );

    this._isBlockSet = false;

    return this;
  }

  writeFooter(footer: string): TabBlock {
    if (footer.trim().length === 0) throw new Error('A footer must not be blank');

    this._setupForNewSection();

    const { footerToAdd, footerInsertStartIdx, fillersToAdd } = this._getFooterInsertPreparation(
      footer
    );

    if (fillersToAdd > 0) {
      this._header += this.getSectionFiller(fillersToAdd);
      this._rows.forEach((row, idx) => (this._rows[idx] = row + this.getRowsFiller(fillersToAdd)));
    }

    const sectionFinalizer = this.sectionSymbol + this.getSectionFiller(this.spacing);
    this._footer = this._footer.slice(0, footerInsertStartIdx) + footerToAdd + sectionFinalizer;

    this._header += sectionFinalizer;
    this._rows.forEach((row, idx) => (this._rows[idx] = row + this.sectionSymbol));
    this.addSpacing();

    return this;
  }

  writeHeader(header: string): TabBlock {
    if (header.trim().length === 0) throw new Error('A header must not be blank');

    this._setupForNewSection();

    this._header +=
      this.sectionSymbol + this.sectionFiller + header + this.getSectionFiller(this.spacing);

    this._rows.forEach((row, idx) => (this._rows[idx] = row + this.sectionSymbol));
    this.addSpacing();

    this._footer += this.sectionSymbol + this.sectionFiller;

    this._isBlockSet = false;

    return this;
  }

  writeNote(note: Note): TabBlock {
    return this.writeParallelNotes([note]);
  }

  writeParallelNotes(notes: Note[]): TabBlock {
    const stringsOutOfRange = this._getStringsOutOfRangeOnNotes(notes);
    if (stringsOutOfRange.length > 0)
      throw new Error(
        `The strings ${stringsOutOfRange.join(', ')} are out of tab strings range. ` +
          `Strings must be between 1 and ${this.numberOfRows}`
      );

    const stringsWithConcurrentNotes = this._getStringsWithConcurrentNotes(notes);
    if (stringsWithConcurrentNotes.length > 0) {
      throw new Error(
        `Multiple notes applied to the tab strings ${stringsWithConcurrentNotes.join(', ')}`
      );
    }

    this._writeInstructionsToRows(notes);
    this.addSpacing();

    return this;
  }

  protected onSpacingChange(oldValue: number, value: number): void {
    const spacingDiff = value - oldValue;

    if (spacingDiff === 0) return;
    else if (spacingDiff > 0) this.addSpacing(spacingDiff);
    else this.removeSpacing(-spacingDiff);
  }

  private _fillBlockToTargetLength(block: string[], blockTargetLength: number): string[] {
    const header = this._getBlockHeader(block);
    const footer = this._getBlockFooter(block);
    const rows = this._getBlockRows(block);

    const formattedHeader = header + this.getSectionFiller(blockTargetLength - header.length);
    const formattedFooter = footer + this.getSectionFiller(blockTargetLength - footer.length);
    const formattedRows = rows.map(
      (row) => row + this.getRowsFiller(blockTargetLength - row.length)
    );

    return [formattedHeader, ...formattedRows, formattedFooter];
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

  private _getBlockRows(block: string[]): string[] {
    return block.slice(this._blockRowsStartIdx, this._blockRowsEndIdx + 1);
  }

  private _getBlockSplitIndexForTargetLength(block: string[], targetBlockLength: number): number {
    const blockLength = this._getBlockLength(block);
    const initialSplitIndex = Math.min(blockLength - 1, targetBlockLength - 1);

    let splitIndex = initialSplitIndex;
    while (splitIndex > 0 && !this._isBlockSplittableAtIndex(block, splitIndex)) {
      splitIndex--;
    }

    if (splitIndex === 0) splitIndex = initialSplitIndex;

    return splitIndex;
  }

  private _getFooterInsertPreparation(footer: string): FooterInsertPreparation {
    const footerToAdd = this.getSectionFiller(this.spacing) + footer + this.sectionFiller;

    const nonSectionFillerFooterIdx = StringHelper.getIndexOfDifferent(
      this._footer,
      this.sectionFiller,
      -1,
      -1
    );

    let footerInsertStartIdx = nonSectionFillerFooterIdx + 1;
    let fillersToAdd = 0;
    if (footerInsertStartIdx + footerToAdd.length <= this._rowsLength) {
      footerInsertStartIdx = this._rowsLength - footerToAdd.length;
    } else {
      fillersToAdd = footerInsertStartIdx + footerToAdd.length - this._rowsLength;
    }

    return { footerToAdd, footerInsertStartIdx, fillersToAdd };
  }

  private _getMinimumFooterLength(): number {
    return this._getMinimumSectionLength(this._footer);
  }

  private _getMinimumHeaderLength(): number {
    return this._getMinimumSectionLength(this._header);
  }

  private _getMinimumSectionLength(section: string): number {
    const nonSectionFillerIdx = StringHelper.getIndexOfDifferent(
      section,
      this.sectionFiller,
      -1,
      -1
    );

    const minimumSectionLenth =
      nonSectionFillerIdx > -1 ? nonSectionFillerIdx + this.spacing + 1 : 0;

    return minimumSectionLenth;
  }

  private _getStringsOutOfRangeOnNotes(notes: Note[]): number[] {
    return this._getUniqueStringsFromNotes(
      notes.filter((note) => !this.isNoteInStringsRange(note))
    );
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

  private _isBlockRowsSplittableAtIndex(block: string[], splitIndex: number): boolean {
    const rows = this._getBlockRows(block);

    const rowsSplittableAtIndex = rows.reduce((rowsSplittableAtIndex, row) => {
      const nextCharacter = row[splitIndex + 1];
      return (
        rowsSplittableAtIndex && (nextCharacter === this.filler || nextCharacter === undefined)
      );
    }, true);

    return rowsSplittableAtIndex;
  }

  private _isBlockSectionSplittableAtIndex(section: string, splitIndex: number): boolean {
    const thisCharacter = section[splitIndex];
    const nextCharacter = section[splitIndex + 1];

    return (
      thisCharacter === this.sectionFiller &&
      (nextCharacter === this.sectionFiller || nextCharacter === undefined)
    );
  }

  private _isBlockSplittableAtIndex(block: string[], splitIndex: number): boolean {
    return (
      this._isBlockHeaderSplittableAtIndex(block, splitIndex) &&
      this._isBlockRowsSplittableAtIndex(block, splitIndex) &&
      this._isBlockFooterSplittableAtIndex(block, splitIndex)
    );
  }

  private _setupForNewSection(): void {
    this._header = this._getBlockHeader(this.block);
    this._footer = this._getBlockFooter(this.block);
    this._rows = this._getBlockRows(this.block);
  }

  private _setupInternalBlock(): void {
    const endBlockLength = Math.max(
      this._rowsLength,
      this._getMinimumHeaderLength(),
      this._getMinimumFooterLength()
    );

    const header =
      this._header.length <= endBlockLength
        ? this._header + this.getSectionFiller(endBlockLength - this._header.length)
        : this._header.slice(0, endBlockLength);

    const footer =
      this._footer.length <= endBlockLength
        ? this._footer + this.getSectionFiller(endBlockLength - this._footer.length)
        : this._footer.slice(0, endBlockLength);

    const rows = this._rows.map((row) =>
      row.length < endBlockLength ? row + this.getRowsFiller(endBlockLength - row.length) : row
    );

    this._block = [header, ...rows, footer];
    this._isBlockSet = true;
  }

  private _splitBlockAtIndex(block: string[], splitIndex: number): BlockSplitResult {
    const blockLength = this._getBlockLength(block);
    const header = this._getBlockHeader(block);
    const footer = this._getBlockFooter(block);
    const rows = this._getBlockRows(block);

    const leftSplit = [
      header.slice(0, splitIndex + 1),
      ...rows.map((row) => row.slice(0, splitIndex + 1)),
      footer.slice(0, splitIndex + 1),
    ];

    let rightSplit;
    if (splitIndex + 1 < blockLength) {
      rightSplit = [
        header.slice(splitIndex + 1),
        ...rows.map((row) => row.slice(splitIndex + 1)),
        footer.slice(splitIndex + 1),
      ];
    }

    return {
      left: leftSplit,
      right: rightSplit,
    };
  }

  private _writeInstructionsToRows(notes: Note[]): void {
    const maxInstructionLength = notes.reduce((maxNoteLength: number, note) => {
      return Math.max(maxNoteLength, note.fret.length);
    }, 0);

    this._rows.forEach((row, idx) => {
      const noteToWrite = notes.find((note) => note.string === idx + 1);
      if (noteToWrite) {
        const rowFillerLength = maxInstructionLength - noteToWrite.fret.length;
        this._rows[idx] = row + noteToWrite.fret + this.getRowsFiller(rowFillerLength);
      } else {
        this._rows[idx] = row + this.getRowsFiller(maxInstructionLength);
      }
    });

    this._isBlockSet = false;
  }
}
