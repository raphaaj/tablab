import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class RepeatInstruction extends Instruction {
  readonly instructions: Instruction[];
  readonly repetitions: number;

  /**
   * Creates a repeat instruction instance.
   * @param instructions - The instruction instances to be repeated.
   * @param repetitions - The number of repetitions.
   */
  constructor(instructions: Instruction[], repetitions: number) {
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
  protected internalWriteOnTab(tab: Tab): InstructionWriteResult {
    let failedInstructionWriteResult: InstructionWriteResult | null = null;

    for (let i = 0; i < this.repetitions; i++) {
      for (let j = 0; j < this.instructions.length; j++) {
        const instruction = this.instructions[j];

        const instructionWriteResult = instruction.writeOnTab(tab);

        if (i === 0 && !instructionWriteResult.success && !failedInstructionWriteResult) {
          failedInstructionWriteResult = instructionWriteResult;
          break;
        }
      }

      if (failedInstructionWriteResult) break;
    }

    const result = failedInstructionWriteResult
      ? failedInstructionWriteResult
      : new SuccessInstructionWriteResult();

    return result;
  }
}
