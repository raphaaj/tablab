import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InvalidInstructionDescriptionFactory } from '../factories/invalid-instruction-description-factory';
import { FailedInstructionWriteResult, InstructionWriteResult } from '../instruction-write-result';

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
      result = this.getFailureResultOnError(tab);
    }

    return result;
  }

  /**
   * Creates a failed instruction write result.
   * @param tab - The tablature over which the write attempt was performed.
   * @returns The created failed instruction writing result.
   */
  protected getFailureResultOnError(tab: Tab): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionReason.UnknownReason;
    const failureDescription = InvalidInstructionDescriptionFactory.getDescription({
      invalidInstructionReason: failureReason,
      tab,
    });

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage: failureDescription,
    });
  }

  protected abstract internalWriteOnTab(tab: Tab): InstructionWriteResult;
}
