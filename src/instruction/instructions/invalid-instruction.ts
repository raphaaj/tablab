import { Instruction } from './instruction';
import { FailedInstructionWriteResult, InstructionWriteResult } from '../instruction-write-result';

export class InvalidInstruction extends Instruction {
  description: string | null;
  reasonIdentifier: string;

  /**
   * Creates an invalid instruction instance.
   * @param reasonIdentifier - A token that identifies the reason for
   * the instruction to be invalid.
   * @param description - A description of the reason for the instruction
   * to be invalid.
   */
  constructor(reasonIdentifier: string, description?: string) {
    super();
    this.reasonIdentifier = reasonIdentifier;
    this.description = description || null;
  }

  /**
   * Returns a failed writing result. The `reasonIdentifier` will be used
   * as the write result `failureReasonIdentifier` and the `description`
   * as the `failureMessage`.
   * @returns A failed writing result.
   */
  protected internalWriteOnTab(): InstructionWriteResult {
    return new FailedInstructionWriteResult({
      failureMessage: this.description,
      failureReasonIdentifier: this.reasonIdentifier,
    });
  }
}
