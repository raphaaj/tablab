import { Note } from '../../tab/note';
import { Tab } from '../../tab/tab';
import { MergeableInstruction } from './mergeable-instruction';

export class WriteNoteInstruction extends MergeableInstruction {
  constructor(note: Note) {
    super(note);
  }

  writeOnTab(tab: Tab): void {
    tab.writeNote(this.note);
  }
}
