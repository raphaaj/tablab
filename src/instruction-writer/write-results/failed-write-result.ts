import { Tab } from '../../tab/tab';
import { BaseInstructionWriter } from '../instruction-writers/base-instruction-writer';
import { BaseWriteResult } from './base-write-result';

/**
 * The options to create a failed write result.
 */
export type FailedWriteResultOptions = {
  /**
   * A collection of child write results related to the current write result.
   * Useful to store the results of the write steps of an instruction writer
   * with multiple write operations.
   */
  childResults?: BaseWriteResult[] | null;

  /**
   * A message that describes the reason for the writing operation to have failed.
   */
  failureMessage: string;

  /**
   * A token that uniquely identifies the reason for the writing operation to have failed.
   */
  failureReasonIdentifier: string;

  /**
   * The instruction writer that executed the write attempt.
   */
  instructionWriter: BaseInstructionWriter;

  /**
   * The tablature over which the write operation took place.
   */
  tab: Tab;
};

/**
 * A failed write result.
 *
 * The base class for all failed write results.
 */
export class FailedWriteResult extends BaseWriteResult {
  /**
   * Creates a failed write result instance.
   * @param options - The options to create a failed write result instance.
   */
  constructor(options: FailedWriteResultOptions) {
    super({ success: false, ...options });
  }
}
