import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';

export class RepeatInstruction extends Instruction {
  instructions: Instruction[];
  repetitions: number;

  constructor(instructions: Instruction[], repetitions: number) {
    super();

    this.instructions = instructions;
    this.repetitions = repetitions;
  }

  writeOnTab(tab: Tab): void {
    for (let i = 0; i < this.repetitions; i++) {
      this.instructions.forEach((instruction) => {
        instruction.writeOnTab(tab);
      });
    }
  }
}
