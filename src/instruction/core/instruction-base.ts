import { Tab } from '../../tab/tab';
import { FailedInstructionWriteResult, InstructionWriteResult } from './instruction-write-result';
import {
  InvalidInstructionBaseReason,
  InvalidInstructionBaseReasonDescription,
} from './enums/invalid-instruction-base-reason';

export abstract class InstructionBase {
  abstract writeOnTab(tab: Tab): InstructionWriteResult;

  protected getUnmappepFailureResult(): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionBaseReason.UnmappedReason;
    const failureMessage = InvalidInstructionBaseReasonDescription[failureReason];

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage,
    });
  }
}
