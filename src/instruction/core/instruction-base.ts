import { Tab } from '../../tab/tab';
import { FailedInstructionWriteResult, InstructionWriteResult } from './instruction-write-result';
import {
  InvalidInstructionReason,
  InvalidInstructionReasonDescription,
} from '../enums/invalid-instruction-reason';

export abstract class InstructionBase {
  abstract writeOnTab(tab: Tab): InstructionWriteResult;

  /**
   * Returns the default writing result for an unexpected failure reason.
   * @returns A failed writing result for an unexpected reason.
   */
  protected getUnmappepFailureResult(): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionReason.UnmappedReason;
    const failureMessage = InvalidInstructionReasonDescription[failureReason];

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage,
    });
  }
}
