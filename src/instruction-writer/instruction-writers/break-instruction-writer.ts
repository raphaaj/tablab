import { Tab } from '../../tab/tab';
import { BaseWriteResult } from '../write-results/base-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a break instruction writer.
 */
export type BreakInstructionWriterOptions = BaseInstructionWriterOptions;

/**
 * A break instruction writer. Once written to a tablature, it adds a tablature
 * block to it.
 */
export class BreakInstructionWriter extends BaseInstructionWriter {
  /**
   * Creates a break instruction writer instance.
   * @param options - The options to create a break instruction writer instance.
   */
  constructor(options: BreakInstructionWriterOptions = {}) {
    super(options);
  }

  /**
   * Adds a tablature block to the given tablature.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    tab.addBlock();

    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}
