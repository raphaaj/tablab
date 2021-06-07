import { RepeatInstruction } from '../../../src/instruction/instructions/repeat-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';
import { Instruction } from '../../../src/instruction/instructions/instruction';
import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../../../src/instruction/instruction-write-result';

class SuccessWriteTestInstruction extends Instruction {
  writeOnTab(): InstructionWriteResult {
    return new SuccessInstructionWriteResult();
  }
}

class FailedWriteTestInstruction extends Instruction {
  constructor(public failureReasonIdentifier: string) {
    super();
  }

  writeOnTab(): InstructionWriteResult {
    return new FailedInstructionWriteResult({
      failureReasonIdentifier: this.failureReasonIdentifier,
    });
  }
}

class ErroredWriteTestInstruction extends Instruction {
  constructor(public errorMessage: string) {
    super();
  }

  writeOnTab(): InstructionWriteResult {
    throw new Error(this.errorMessage);
  }
}

describe(`[${RepeatInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new RepeatInstruction([], 2);

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  describe('[writeOnTab]', () => {
    it('should repeatedly write the instructions to repeat on write, returning a success write result', () => {
      const repetitions = 3;
      const instructionsToRepeat = [
        new SuccessWriteTestInstruction(),
        new SuccessWriteTestInstruction(),
      ];
      const instruction = new RepeatInstruction(instructionsToRepeat, repetitions);
      const tab = new Tab();

      instructionsToRepeat.forEach(
        (instruction) => (instruction.writeOnTab = jest.fn(instruction.writeOnTab))
      );
      const writeResult = instruction.writeOnTab(tab);

      expect(writeResult.success).toBe(true);
      instructionsToRepeat.forEach((instruction) => {
        expect(instruction.writeOnTab).toHaveBeenCalledTimes(repetitions);

        for (let i = 0; i < repetitions; i++) {
          expect(instruction.writeOnTab).toHaveBeenNthCalledWith(i + 1, tab);
        }
      });
    });

    it('should return a failed write result on error', () => {
      const errorMessage = 'repeat: an unexpected error occurred';
      const instructionToRepeat = new ErroredWriteTestInstruction(errorMessage);
      const instruction = new RepeatInstruction([instructionToRepeat], 1);
      const tab = new Tab();

      instructionToRepeat.writeOnTab = jest.fn(instructionToRepeat.writeOnTab);
      const writeResult = instruction.writeOnTab(tab);

      expect(instructionToRepeat.writeOnTab).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.failureMessage).toContain(errorMessage);
    });

    it('should return a failed write result when the instruction to repeat fails to be written on tab', () => {
      const writeFailReason = 'TEST_REASON';
      const instructionToRepeat = new FailedWriteTestInstruction(writeFailReason);
      const instruction = new RepeatInstruction([instructionToRepeat], 1);
      const tab = new Tab();

      instructionToRepeat.writeOnTab = jest.fn(instructionToRepeat.writeOnTab);
      const writeResult = instruction.writeOnTab(tab);

      expect(instructionToRepeat.writeOnTab).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(writeFailReason);
    });
  });
});
