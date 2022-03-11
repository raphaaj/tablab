import { Tab } from '../../tab/tab';
import { BaseInstructionWriter } from '../instruction-writers/base-instruction-writer';

/**
 * The options to create a "base" write result.
 */
export type BaseWriteResultOptions = {
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
    failureMessage,
    failureReasonIdentifier,
    instructionWriter,
    success,
    tab,
  }: BaseWriteResultOptions) {
    if (!success && !failureReasonIdentifier)
      throw new Error(
        'Failed to create an unsuccessful write result. ' +
          'A failure reason identifier must be provided.'
      );

    this.failureMessage = failureMessage || null;
    this.failureReasonIdentifier = failureReasonIdentifier || null;
    this.success = success;

    this.instructionWriter = instructionWriter;
    this.tab = tab;
  }
}
