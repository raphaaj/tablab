import { Tab } from '../../tab/tab';
import { BaseWriteResult } from '../write-results/base-write-result';
import { FailedWriteResult } from '../write-results/failed-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a "base" invalid instruction writer.
 */
export type BaseInvalidInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * A description of the reason for the instruction to be invalid.
   */
  description: string;

  /**
   * A token that uniquely identifies the reason for the instruction to be
   * invalid.
   */
  reasonIdentifier: string;
};

/**
 * A general invalid instruction writer instance. It always returns a failed
 * write result once written to a tablature.
 *
 * The base class for all invalid instruction writers.
 */
export class BaseInvalidInstructionWriter extends BaseInstructionWriter {
  /**
   * The description of the reason for the instruction to be invalid.
   */
  readonly description: string;

  /**
   * The token that uniquely identifies the reason for the instruction to be
   * invalid.
   */
  readonly reasonIdentifier: string;

  /**
   * Creates a "base" invalid instruction writer instance.
   * @param options - The options to create a "base" invalid instruction writer instance.
   */
  constructor(options: BaseInvalidInstructionWriterOptions) {
    super(options);

    this.reasonIdentifier = options.reasonIdentifier;
    this.description = options.description;
  }

  /**
   * Does not act on the given tablature. It returns a failed write result with
   * `reasonIdentifier` as the `failureReasonIdentifier` and `description` as
   * the `failureMessage`.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new FailedWriteResult({
      failureMessage: this.description,
      failureReasonIdentifier: this.reasonIdentifier,
      instructionWriter: this,
      tab,
    });
  }
}
