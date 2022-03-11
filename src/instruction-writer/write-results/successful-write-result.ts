import { Tab } from '../../tab/tab';
import { BaseInstructionWriter } from '../instruction-writers/base-instruction-writer';
import { BaseWriteResult } from './base-write-result';

/**
 * The options to create a successful write result.
 */
export type SuccessfulWriteResultOptions = {
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
 * A successful write result.
 *
 * The base class for all successful write results.
 */
export class SuccessfulWriteResult extends BaseWriteResult {
  /**
   * Creates a successful write result instance.
   * @param options - The options to create a successful write result instance.
   */
  constructor(options: SuccessfulWriteResultOptions) {
    super({ success: true, ...options });
  }
}
