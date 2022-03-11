import { Tab } from '../../tab/tab';
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
    let failedWriteResult: BaseWriteResult | null = null;

    for (let i = 0; i < this.numberOfRepetitions; i++) {
      for (let j = 0; j < this.instructionWritersToRepeat.length; j++) {
        const instructionWriteResult = this.instructionWritersToRepeat[j].writeOnTab(tab);

        if (i === 0 && !instructionWriteResult.success && !failedWriteResult) {
          failedWriteResult = instructionWriteResult;
          break;
        }
      }

      if (failedWriteResult) break;
    }

    let writeResult: BaseWriteResult;
    if (failedWriteResult) {
      writeResult = new FailedWriteResult({
        failureMessage: failedWriteResult.failureMessage as string,
        failureReasonIdentifier: failedWriteResult.failureReasonIdentifier as string,
        instructionWriter: this,
        tab,
      });
    } else {
      writeResult = new SuccessfulWriteResult({ instructionWriter: this, tab });
    }

    return writeResult;
  }
}
