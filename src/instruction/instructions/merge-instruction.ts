import { InstructionBase } from '../core/instruction-base';
import { MergeableInstructionBase } from '../core/mergeable-instruction-base';
import { Tab } from '../../tab/tab';
import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';
import {
  InvalidInstructionReason,
  InvalidInstructionReasonDescription,
} from '../enums/invalid-instruction-reason';
import { StringHelper } from '../../helpers/string-helper';

export class MergeInstruction extends InstructionBase {
  readonly instructions: MergeableInstructionBase[];

  /**
   * Creates a merge instruction instance.
   * @param instructions - The instruction instances to be merged.
   */
  constructor(instructions: MergeableInstructionBase[]) {
    super();

    this.instructions = instructions;
  }

  /**
   * Writes the `instructions` notes to the tablature. These notes
   * are written in parallel.
   * @param tab - The tablature to write the notes.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    const notes = this.instructions.map((instruction) => instruction.note);
    const nonWritableNotes = notes.filter((note) => !tab.isNoteWritable(note));
    if (nonWritableNotes.length > 0) {
      result = this._getNonWritableNotesFailureResult(tab.numberOfStrings);
    } else {
      try {
        tab.writeParallelNotes(notes);

        result = new SuccessInstructionWriteResult();
      } catch (e) {
        result = this.getUnmappepFailureResult();
      }
    }

    return result;
  }

  private _getNonWritableNotesFailureResult(
    maxTabStringValue: number
  ): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes;
    const description = InvalidInstructionReasonDescription[failureReason];
    const failureMessage = StringHelper.format(description, [maxTabStringValue.toString()]);

    return new FailedInstructionWriteResult({
      failureReasonIdentifier: failureReason,
      failureMessage,
    });
  }
}
