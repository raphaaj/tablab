import { Note } from '../../tab/note';
import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InternalFailedWriteResultDescriptionFactory } from '../factories/internal-failed-write-result-description-factory';
import { BaseWriteResult } from '../write-results/base-write-result';
import { FailedWriteResult } from '../write-results/failed-write-result';
import { SuccessfulWriteResult } from '../write-results/successful-write-result';
import { BaseInstructionWriterOptions } from './base-instruction-writer';
import { MergeableInstructionWriter } from './mergeable-instruction-writer';

/**
 * The options to create a note instruction writer.
 */
export type NoteInstructionWriterOptions = BaseInstructionWriterOptions & {
  /**
   * The note to write.
   */
  note: Note;
};

/**
 * A note instruction writer. Once written to a tablature, it writes a
 * note to it.
 */
export class NoteInstructionWriter extends MergeableInstructionWriter {
  /**
   * Creates a note instruction writer instance.
   * @param options - The options to create a note instruction writer instance.
   */
  constructor(options: NoteInstructionWriterOptions) {
    super(options);
  }

  /**
   * Writes the `note` to the given tablature.
   * @param tab - The tablature to write the instruction.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    let writeResult: BaseWriteResult;

    if (tab.isNoteWritable(this.note)) {
      tab.writeNote(this.note);

      writeResult = new SuccessfulWriteResult({ instructionWriter: this, tab });
    } else {
      writeResult = this._getWriteResultForNonWritableNote(tab);
    }

    return writeResult;
  }

  private _getWriteResultForNonWritableNote(tab: Tab): FailedWriteResult {
    const failureReasonIdentifier = InvalidInstructionReason.BasicInstructionWithNonWritableNote;

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
