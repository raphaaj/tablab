import { ParsedInstructionData } from '../../parser/parsed-instruction';
import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InternalFailedWriteResultDescriptionFactory } from '../factories/internal-failed-write-result-description-factory';
import { BaseWriteResult } from '../write-results/base-write-result';
import { FailedWriteResult } from '../write-results/failed-write-result';

/**
 * The options to create a "base" instruction writer.
 */
export type BaseInstructionWriterOptions = {
  /**
   * The parsed instruction data that led to the creation of the instruction
   * writer.
   */
  parsedInstruction: ParsedInstructionData;
};

/**
 * The base class for all instruction writers.
 */
export abstract class BaseInstructionWriter {
  /**
   * The parsed instruction data that led to the creation of the instruction
   * writer.
   */
  readonly parsedInstruction: ParsedInstructionData;

  constructor(options: BaseInstructionWriterOptions) {
    this.parsedInstruction = options.parsedInstruction;
  }

  /**
   * Writes the instruction to the given tablature.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): BaseWriteResult {
    let writeResult: BaseWriteResult;

    try {
      writeResult = this.internalWriteOnTab(tab);
    } catch {
      writeResult = this._getWriteResultOnError(tab);
    }

    return writeResult;
  }

  protected abstract internalWriteOnTab(tab: Tab): BaseWriteResult;

  private _getWriteResultOnError(tab: Tab): BaseWriteResult {
    const failureReasonIdentifier = InvalidInstructionReason.UnknownReason;

    const descriptionFactory = new InternalFailedWriteResultDescriptionFactory();
    const failureMessage = descriptionFactory.getDescription(failureReasonIdentifier, {
      parsedInstruction: this.parsedInstruction,
      tab,
    });

    return new FailedWriteResult({
      failureMessage,
      failureReasonIdentifier,
      instructionWriter: this,
      tab,
    });
  }
}
