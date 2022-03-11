import { Tab } from '../../tab/tab';
import { BaseWriteResult } from '../write-results/base-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a footer instruction writer.
 */
export type FooterInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * The footer message to write.
   */
  footer: string;
};

/**
 * A footer instruction writer. Once written to a tablature, it writes a footer
 * to it.
 */
export class FooterInstructionWriter extends BaseInstructionWriter {
  /**
   * The footer message to write.
   */
  readonly footer: string;

  /**
   * Creates a footer instruction writer instance.
   * @param options - The options to create a footer instruction writer instance.
   */
  constructor(options: FooterInstructionWriterOptions) {
    super(options);

    this.footer = options.footer;
  }

  /**
   * Writes the `footer` to the tablature.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    tab.writeFooter(this.footer);

    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}
