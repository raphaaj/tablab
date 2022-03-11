import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InternalFailedWriteResultDescriptionFactory } from '../factories/internal-failed-write-result-description-factory';
import { BaseWriteResult } from '../write-results/base-write-result';
import { FailedWriteResult } from '../write-results/failed-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';
import { MergeableInstructionWriter } from './mergeable-instruction-writer';

/**
 * The options to create a merge instruction writer.
 */
export type MergeInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * The instruction writer instances to write in parallel.
   */
  instructionWritersToMerge: MergeableInstructionWriter[];
};

/**
 * A merge instruction writer. Once written to a tablature, it writes a
 * set of instruction writers in parallel to it.
 */
export class MergeInstructionWriter extends BaseInstructionWriter {
  /**
   * The instruction writer instances to write in parallel.
   */
  readonly instructionWritersToMerge: MergeableInstructionWriter[];

  /**
   * Creates a merge instruction writer instance.
   * @param options - The options to create a merge instruction writer instance.
   */
  constructor(options: MergeInstructionWriterOptions) {
    super(options);

    this.instructionWritersToMerge = options.instructionWritersToMerge;
  }

  /**
   * Writes the `instructionWritersToMerge` to the tablature in parallel.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    let writeResult: BaseWriteResult;

    const notes = this.instructionWritersToMerge.map((instruction) => instruction.note);
    const nonWritableNotes = notes.filter((note) => !tab.isNoteWritable(note));

    if (nonWritableNotes.length > 0) {
      writeResult = this._getWriteResultForNonWritableNotes(tab);
    } else {
      tab.writeParallelNotes(notes);

      writeResult = new SuccessfulWriteResult({ instructionWriter: this, tab });
    }

    return writeResult;
  }

  private _getWriteResultForNonWritableNotes(tab: Tab): FailedWriteResult {
    const failureReasonIdentifier =
      InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes;

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
