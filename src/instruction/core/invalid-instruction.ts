import { InstructionBase } from './instruction-base';
import { FailedInstructionWriteResult, InstructionWriteResult } from './instruction-write-result';

export class InvalidInstruction extends InstructionBase {
  description: string | null;
  reasonIdentifier: string;

  constructor(reasonIdentifier: string, description?: string) {
    super();
    this.reasonIdentifier = reasonIdentifier;
    this.description = description || null;
  }

  writeOnTab(): InstructionWriteResult {
    return new FailedInstructionWriteResult({
      failureMessage: this.description,
      failureReasonIdentifier: this.reasonIdentifier,
    });
  }
}
