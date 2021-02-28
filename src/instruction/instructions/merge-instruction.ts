import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { MergeableInstruction } from './mergeable-instruction';

export class MergeInstruction extends Instruction {
  instructions: MergeableInstruction[];

  constructor(instructions: MergeableInstruction[]) {
    super();

    this.instructions = instructions;
  }

  writeOnTab(tab: Tab): void {
    const notes = this.instructions.map((instruction) => instruction.note);

    tab.writeParallelNotes(notes);
  }
}
