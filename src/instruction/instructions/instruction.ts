import { Tab } from '../../tab/tab';
import { FailedInstructionWriteResult, InstructionWriteResult } from '../instruction-write-result';
import {
  InvalidInstructionReason,
  InvalidInstructionReasonDescription,
} from '../enums/invalid-instruction-reason';
import { StringHelper } from '../../helpers/string-helper';

export abstract class Instruction {
  /**
   * Writes the instruction to the given tablature.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      result = this.internalWriteOnTab(tab);
    } catch (e) {
      if (e instanceof Error) {
        result = this.getFailureResultOnError(e);
      } else {
        result = this.getFailureResultOnError(new Error('Unknown error'));
      }
    }

    return result;
  }

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

  protected abstract internalWriteOnTab(tab: Tab): InstructionWriteResult;
}
