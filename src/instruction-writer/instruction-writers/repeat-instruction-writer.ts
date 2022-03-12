import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InternalFailedWriteResultDescriptionFactory } from '../factories/internal-failed-write-result-description-factory';
import { BaseWriteResult } from '../write-results/base-write-result';
import { FailedWriteResult } from '../write-results/failed-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a repeat instruction writer.
 */
export type RepeatInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * The instruction writer instances to write repeatedly.
   */
  instructionWritersToRepeat: BaseInstructionWriter[];

  /**
   * The number of repetitions.
   */
  numberOfRepetitions: number;
};

/**
 * A repeat instruction writer. Once written to a tablature, it writes a set
 * of instruction writers repeatedly to it.
 */
export class RepeatInstructionWriter extends BaseInstructionWriter {
  /**
   * The instruction writer instances to write repeatedly.
   */
  readonly instructionWritersToRepeat: BaseInstructionWriter[];

  /**
   * The number of repetitions.
   */
  readonly numberOfRepetitions: number;

  /**
   * Creates a repeat instruction writer instance.
   * @param options - The options to create a repeat instruction writer instance.
   */
  constructor(options: RepeatInstructionWriterOptions) {
    super(options);

    this.instructionWritersToRepeat = options.instructionWritersToRepeat;
    this.numberOfRepetitions = options.numberOfRepetitions;
  }

  /**
   * Writes the `instructionWritersToRepeat` to the given tablature `n` times,
   * where `n` is the `numberOfRepetitions` value.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    const childResults: BaseWriteResult[] = [];

    let allInstructionWritersSuccessfullyWrittenToTab = true;
    for (let i = 0; i < this.numberOfRepetitions; i++) {
      for (let j = 0; j < this.instructionWritersToRepeat.length; j++) {
        const currentInstructionWriter = this.instructionWritersToRepeat[j];
        const currentWriteResult = currentInstructionWriter.writeOnTab(tab);

        if (i === 0) {
          childResults.push(currentWriteResult);

          allInstructionWritersSuccessfullyWrittenToTab =
            allInstructionWritersSuccessfullyWrittenToTab && currentWriteResult.success;
        }
      }
    }

    let writeResult: BaseWriteResult;
    if (allInstructionWritersSuccessfullyWrittenToTab) {
      writeResult = new SuccessfulWriteResult({ childResults, instructionWriter: this, tab });
    } else {
      writeResult = this._getWriteResultForFailedWrites(tab, childResults);
    }

    return writeResult;
  }

  private _getWriteResultForFailedWrites(
    tab: Tab,
    childResults: BaseWriteResult[]
  ): BaseWriteResult {
    const failureReasonIdentifier = InvalidInstructionReason.RepeatInstructionWithInvalidTargets;

    const descriptionFactory = new InternalFailedWriteResultDescriptionFactory();
    const failureMessage = descriptionFactory.getDescription(failureReasonIdentifier, {
      parsedInstruction: this.parsedInstruction,
      tab,
    });

    return new FailedWriteResult({
      childResults,
      failureMessage,
      failureReasonIdentifier,
      instructionWriter: this,
      tab,
    });
  }
}
