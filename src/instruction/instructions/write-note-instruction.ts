import { Note } from '../../tab/note';
import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InvalidInstructionDescriptionFactory } from '../factories/invalid-instruction-description-factory';
import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../instruction-write-result';
import { MergeableInstruction } from './mergeable-instruction';

export class WriteNoteInstruction extends MergeableInstruction {
  /**
   * Creates a write note instruction instance.
   * @param note - The note to be written to the tablature.
   */
  constructor(note: Note) {
    super(note);
  }

  /**
   * Writes the `note` to the given tablature.
   * @param tab - The tablature to write the note.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    if (tab.isNoteWritable(this.note)) {
      tab.writeNote(this.note);

      result = new SuccessInstructionWriteResult();
    } else {
      result = this._getNonWritableNoteFailureResult(tab);
    }

    return result;
  }

  private _getNonWritableNoteFailureResult(tab: Tab): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionReason.BasicInstructionWithNonWritableNote;
    const failureDescription = InvalidInstructionDescriptionFactory.getDescription({
      invalidInstructionReason: failureReason,
      tab,
    });

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage: failureDescription,
    });
  }
}
