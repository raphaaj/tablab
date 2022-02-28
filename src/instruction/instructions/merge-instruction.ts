import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InvalidInstructionDescriptionFactory } from '../factories/invalid-instruction-description-factory';
import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../instruction-write-result';
import { Instruction } from './instruction';
import { MergeableInstruction } from './mergeable-instruction';

export class MergeInstruction extends Instruction {
  readonly instructions: MergeableInstruction[];

  /**
   * Creates a merge instruction instance.
   * @param instructions - The instruction instances to be merged.
   */
  constructor(instructions: MergeableInstruction[]) {
    super();

    this.instructions = instructions;
  }

  /**
   * Writes the `instructions` notes to the tablature. These notes
   * are written in parallel.
   * @param tab - The tablature to write the notes.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    const notes = this.instructions.map((instruction) => instruction.note);
    const nonWritableNotes = notes.filter((note) => !tab.isNoteWritable(note));

    if (nonWritableNotes.length > 0) {
      result = this._getNonWritableNotesFailureResult(tab);
    } else {
      tab.writeParallelNotes(notes);

      result = new SuccessInstructionWriteResult();
    }

    return result;
  }

  private _getNonWritableNotesFailureResult(tab: Tab): FailedInstructionWriteResult {
    const failureReason = InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes;
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
