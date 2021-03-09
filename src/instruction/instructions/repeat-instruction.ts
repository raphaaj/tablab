import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class RepeatInstruction extends InstructionBase {
  readonly instructions: InstructionBase[];
  readonly repetitions: number;

  constructor(instructions: InstructionBase[], repetitions: number) {
    super();

    this.instructions = instructions;
    this.repetitions = repetitions;
  }
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult = new SuccessInstructionWriteResult();

    try {
      for (let i = 0; i < this.repetitions; i++) {
        for (let j = 0; j < this.instructions.length; j++) {
          const instruction = this.instructions[j];

          result = instruction.writeOnTab(tab);

          if (i === 0 && !result.success) break;
        }
      }
    } catch (e) {
      result = this.getUnmappepFailureResult();
    }

    return result;
  }
}
