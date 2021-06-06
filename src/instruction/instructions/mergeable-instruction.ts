import { Note } from '../../tab/note';
import { Instruction } from './instruction';

export abstract class MergeableInstruction extends Instruction {
  readonly note: Note;

  constructor(note: Note) {
    super();

    this.note = note;
  }
}
