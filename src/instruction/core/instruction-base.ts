import { Tab } from '../../tab/tab';
import { FailedInstructionWriteResult, InstructionWriteResult } from './instruction-write-result';
import {
  InvalidInstructionBaseReason,
  InvalidInstructionBaseReasonDescription,
} from './enums/invalid-instruction-base-reason';

export abstract class InstructionBase {
  abstract writeOnTab(tab: Tab): InstructionWriteResult;

  /**
   * Returns the default writing result for an unexpected failure reason.
   * @returns A failed writing result for an unexpected reason.
   */
  protected getUnmappepFailureResult(): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionBaseReason.UnmappedReason;
    const failureMessage = InvalidInstructionBaseReasonDescription[failureReason];

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage,
    });
  }
}
