import { TabElement, TabElementOptions } from './tab-element';
import { TabBlock } from './tab-block';
import { Note } from './note';

export class Tab extends TabElement {
  /**
   * A tablature is composed of tablature blocks, where each block is a tablature element
   * that handles its state and operations.
   *
   * Use the method `addBlock` to add blocks to the tablature.
   *
   * Although it is possible to execute operations over each block independently, it is
   * advisable to perform these operations over the tablature, letting it handle the
   * necessary block operations as needed.
   *
   * @see {@link TabBlock}
   */
  readonly blocks: TabElement[];

  /**
   * The block selected to perform the tablature operations. It is the last block of the
   * tablature blocks.
   *
   * @see {@link Tab.blocks}
   */
  get currentBlock(): TabElement {
    return this.blocks[this.blocks.length - 1];
  }

  /**
   * Creates a tablature with one initial block.
   * @param options - The options used to create a tablature.
   *
   * @see {@link Tab.blocks}
   */
  constructor(options?: TabElementOptions) {
    super(options);
    this.blocks = [];

    this.addBlock();
  }

  /**
   * Creates a new block in the tablature. The block will be created with the tablature
   * parameters at the addition time.
   * @returns The tablature.
   */
  addBlock(): Tab {
    const tabBlock = new TabBlock({
      numberOfStrings: this.numberOfStrings,
      sectionDivisionCharacter: this.sectionDivisionCharacter,
      spacing: this.spacing,
      spacingCharacter: this.spacingCharacter,
    });

    this.blocks.push(tabBlock);

    return this;
  }

  /**
   * Adds spacing characters to the current tablature block.
   * @param spacing - The number of spacing characters to add. If omitted, the `spacing`
   * value of the current tablature block will be used.
   * @returns The tablature.
   *
   * @see {@link Tab.currentBlock}
   */
  addSpacing(spacing?: number): this {
    this.currentBlock.addSpacing(spacing);

    return this;
  }

  /**
   * Formats the tablature. Each block of the tablature will be formatted with the given
   * block length.
   * @param blockLength - The length expected for each formatted tablature block.
   * @returns The formatted tablature.
   */
  format(blockLength: number): string[][] {
    const formattedBlocks = this.blocks.reduce((formattedBlocks, block) => {
      return formattedBlocks.concat(block.format(blockLength));
    }, [] as string[][]);

    return formattedBlocks;
  }

  /**
   * Removes spacing characters from the current tablature block.
   * @param spacing - The number of spacing characters to remove. If omitted, the `spacing`
   * value of the current tablature block will be used.
   * @returns The tablature.
   *
   * @see {@link Tab.currentBlock}
   */
  removeSpacing(spacing?: number | undefined): this {
    this.currentBlock.removeSpacing(spacing);

    return this;
  }

  /**
   * Writes a footer in the footer section of the current tablature block.
   * @param footer - The footer to be written. It must be a non-empty string.
   * @returns The tablature.
   *
   * @see {@link Tab.currentBlock}
   */
  writeFooter(footer: string): this {
    this.currentBlock.writeFooter(footer);

    return this;
  }

  /**
   * Writes a header in the header section of the current tablature block.
   * @param header - The header to be written. It must be a non-empty string.
   * @returns The tablature.
   *
   * @see {@link Tab.currentBlock}
   */
  writeHeader(header: string): this {
    this.currentBlock.writeHeader(header);

    return this;
  }

  /**
   * Writes a note in the current tablature block. The string of the note
   * must be in the tablature strings range.
   * @param note - The note to be written.
   * @returns The tablature.
   *
   * @see {@link Tab.currentBlock}
   */
  writeNote(note: Note): this {
    this.currentBlock.writeNote(note);

    return this;
  }

  /**
   * Writes multiple notes in the current tablature block. The notes will be written in parallel,
   * i.e., in the same tablature time. The string of all notes must be in the tablature strings
   * range, and there must be no set of notes sharing the same string value.
   * @param notes - The notes to be written in parallel.
   * @returns The tablature.
   *
   * @see {@link Tab.currentBlock}
   */
  writeParallelNotes(notes: Note[]): this {
    this.currentBlock.writeParallelNotes(notes);

    return this;
  }

  /**
   * Set the spacing of the current tablature block with the new spacing value.
   * @param oldValue - The old spacing value.
   * @param value - The new spacing value.
   *
   * @see {@link Tab.currentBlock}
   */
  protected onSpacingChange(oldValue: number, value: number): void {
    this.currentBlock.spacing = value;
  }
}
