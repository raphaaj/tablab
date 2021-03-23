import { MergeableInstructionBase } from '../core/mergeable-instruction-base';
import { Note } from '../../tab/note';
import { Tab } from '../../tab/tab';
import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';
import { StringHelper } from '../../helpers/string-helper';
import {
  InvalidInstructionBaseReason,
  InvalidInstructionBaseReasonDescription,
} from './enums/invalid-instruction-base-reason';

export class WriteNoteInstruction extends MergeableInstructionBase {
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
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    if (tab.isNoteInStringsRange(this.note)) {
      try {
        tab.writeNote(this.note);

        result = new SuccessInstructionWriteResult();
      } catch (e) {
        result = this.getUnmappepFailureResult();
      }
    } else {
      result = this._getStringOutOfTabRangeFailureResult(tab.numberOfRows);
    }

    return result;
  }

  private _getStringOutOfTabRangeFailureResult(
    maxTabStringValue: number
  ): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionBaseReason.WriteNoteInstructionWithStringOutOfTabRange;
    const description = InvalidInstructionBaseReasonDescription[failureReason];
    const failureMessage = StringHelper.format(description, [maxTabStringValue.toString()]);

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage,
    });
  }
}
