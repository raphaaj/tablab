import { Tab } from '../../tab/tab';
import { BaseWriteResult } from '../write-results/base-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a set spacing instruction writer.
 */
export type SetSpacingInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * The spacing value.
   */
  spacing: number;
};

/**
 * A set spacing instruction writer. Once written to a tablature, it sets the
 * spacing value of it.
 */
export class SetSpacingInstructionWriter extends BaseInstructionWriter {
  /**
   * The spacing value.
   */
  readonly spacing: number;

  /**
   * Creates a set spacing instruction writer instance.
   * @param options - The options to create a set spacing instruction writer instance.
   */
  constructor(options: SetSpacingInstructionWriterOptions) {
    super(options);

    this.spacing = options.spacing;
  }

  /**
   * Sets the spacing of the tablature to the `spacing` value.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    tab.setSpacing(this.spacing);

    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}
