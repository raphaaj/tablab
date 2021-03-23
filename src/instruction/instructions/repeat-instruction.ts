import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class RepeatInstruction extends InstructionBase {
  readonly instructions: InstructionBase[];
  readonly repetitions: number;

  /**
   * Creates a repeat instruction instance.
   * @param instructions - The instruction instances to be repeated.
   * @param repetitions - The number of repetitions.
   */
  constructor(instructions: InstructionBase[], repetitions: number) {
    super();

    this.instructions = instructions;
    this.repetitions = repetitions;
  }

  /**
   * Writes the `instructions` to the tablature `n` times, where `n`
   * is the `repetitions` value.
   * @param tab - The tablature to write the instructions.
   * @returns The result of the writing operation.
   */
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
