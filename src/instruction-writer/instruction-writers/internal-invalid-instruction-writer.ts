import { ParsedInstructionData } from '../../parser/parsed-instruction';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InternalFailedWriteResultDescriptionFactory } from '../factories/internal-failed-write-result-description-factory';
import { BaseInstructionWriterOptions } from './base-instruction-writer';
import { BaseInvalidInstructionWriter } from './base-invalid-instruction-writer';

export type InternalInvalidInstructionWriterOptions = BaseInstructionWriterOptions & {
  reasonIdentifier: InvalidInstructionReason;
};

export class InternalInvalidInstructionWriter extends BaseInvalidInstructionWriter {
  private static _getDescription(
    reasonIdentifier: InvalidInstructionReason,
    parsedInstruction?: ParsedInstructionData | null
  ): string {
    const descriptionFactory = new InternalFailedWriteResultDescriptionFactory();
    const description = descriptionFactory.getDescription(reasonIdentifier, {
      parsedInstruction: parsedInstruction,
    });

    return description;
  }

  constructor({ reasonIdentifier, parsedInstruction }: InternalInvalidInstructionWriterOptions) {
    super({
      parsedInstruction,
      reasonIdentifier,
      description: InternalInvalidInstructionWriter._getDescription(
        reasonIdentifier,
        parsedInstruction
      ),
    });
  }
}
