import { Tab } from '../../tab/tab';
import { BaseWriteResult } from '../write-results/base-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a header instruction writer.
 */
export type HeaderInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * The header message to write.
   */
  header: string;
};

/**
 * A header instruction writer. Once written to a tablature, it writes a header
 * to it.
 */
export class HeaderInstructionWriter extends BaseInstructionWriter {
  /**
   * The header message to write.
   */
  readonly header: string;

  /**
   * Creates a header instruction writer instance.
   * @param options - The options to create a header instruction writer instance.
   */
  constructor(options: HeaderInstructionWriterOptions) {
    super(options);

    this.header = options.header;
  }

  /**
   * Writes the `header` to the tablature.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    tab.writeHeader(this.header);

    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}
