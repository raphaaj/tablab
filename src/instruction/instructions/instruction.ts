import { Tab } from '../../tab/tab';
import { FailedInstructionWriteResult, InstructionWriteResult } from '../instruction-write-result';
import {
  InvalidInstructionReason,
  InvalidInstructionReasonDescription,
} from '../enums/invalid-instruction-reason';
import { StringHelper } from '../../helpers/string-helper';

export abstract class Instruction {
  abstract writeOnTab(tab: Tab): InstructionWriteResult;

  /**
   * Creates a failed instruction write result based on a given error.
   * @param error - The error to be used to create the writing result.
   * @returns The created failed instruction writing result.
   */
  protected getFailureResultOnError(error: Error): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionReason.UnknownReason;
    const failureDescription = InvalidInstructionReasonDescription[failureReason];
    const failureMessage = StringHelper.format(failureDescription, [error.message]);

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage,
    });
  }
}
