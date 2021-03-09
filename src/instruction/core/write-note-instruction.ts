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
  constructor(note: Note) {
    super(note);
  }

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
      result = this._getStringOutOfTabRangeFailureResult(tab.rows);
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
