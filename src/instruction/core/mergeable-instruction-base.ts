import { Note } from '../../tab/note';
import { InstructionBase } from './instruction-base';

export abstract class MergeableInstructionBase extends InstructionBase {
  readonly note: Note;

  constructor(note: Note) {
    super();

    this.note = note;
  }
}
