import { Tab } from '../../tab/tab';
import { BaseInstructionWriter } from '../instruction-writers/base-instruction-writer';

/**
 * The options to create a "base" write result.
 */
export type BaseWriteResultOptions = {
  /**
   * A collection of child write results related to the current write result.
   * Useful to store the results of the write steps of an instruction writer
   * with multiple write operations.
   */
  childResults?: BaseWriteResult[] | null;

  /**
   * A message that describes the reason for the writing operation to have failed.
   */
  failureMessage?: string | null;

  /**
   * A token that uniquely identifies the reason for the writing operation to have failed.
   */
  failureReasonIdentifier?: string | null;

  /**
   * The instruction writer that executed the write attempt.
   */
  instructionWriter: BaseInstructionWriter;

  /**
   * An indication of whether the write operation has succeeded or not.
   */
  success: boolean;

  /**
   * The tablature over which the write operation took place.
   */
  tab: Tab;
};

/**
 * A general write result.
 *
 * The base class for all write results.
 */
export class BaseWriteResult {
  /**
   * A collection of child write results related to the current write result.
   */
  readonly childResults: BaseWriteResult[] | null;

  /**
   * The message that describes the reason for the writing operation to have failed.
   */
  failureMessage: string | null;

  /**
   * The token that uniquely identifies the reason for the writing operation to have failed.
   */
  readonly failureReasonIdentifier: string | null;

  /**
   * The instruction writer that executed the write attempt.
   */
  readonly instructionWriter: BaseInstructionWriter;

  /**
   * The indication of whether the writing operation has succeeded or not.
   */
  readonly success: boolean;

  /**
   * The tablature over which the write operation took place.
   */
  readonly tab: Tab;

  /**
   * Creates a "base" write result instance.
   * @param options - The options to create a "base" write result instance.
   */
  constructor({
    childResults,
    failureMessage,
    failureReasonIdentifier,
    instructionWriter,
    success,
    tab,
  }: BaseWriteResultOptions) {
    if (success && failureReasonIdentifier)
      throw new Error(
        'Failed to create an successful write result. ' +
          'A successful write result must not have a failure reason identifier.'
      );
    if (!success && !failureReasonIdentifier)
      throw new Error(
        'Failed to create an failed write result. ' +
          'A failed write result must have a failure reason identifier.'
      );

    this.childResults = childResults || null;
    this.failureMessage = failureMessage || null;
    this.failureReasonIdentifier = failureReasonIdentifier || null;
    this.instructionWriter = instructionWriter;
    this.success = success;
    this.tab = tab;
  }
}
