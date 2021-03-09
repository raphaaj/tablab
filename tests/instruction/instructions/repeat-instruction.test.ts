import { RepeatInstruction } from '../../../src/instruction/instructions/repeat-instruction';
import { MergeableInstructionBase } from '../../../src/instruction/core/mergeable-instruction-base';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionBaseReason } from '../../../src/instruction/core/enums/invalid-instruction-base-reason';
import { InstructionBase } from '../../../src/instruction/core/instruction-base';
import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../../../src/instruction/core/instruction-write-result';

class SuccessWriteTestInstruction extends InstructionBase {
  writeOnTab(): InstructionWriteResult {
    return new SuccessInstructionWriteResult();
  }
}

class FailedWriteTestInstruction extends InstructionBase {
  constructor(public failureReasonIdentifier: string) {
    super();
  }

  writeOnTab(): InstructionWriteResult {
    return new FailedInstructionWriteResult({
      failureReasonIdentifier: this.failureReasonIdentifier,
    });
  }
}

class ErroredWriteTestInstruction extends InstructionBase {
  writeOnTab(): InstructionWriteResult {
    throw new Error('Method not implemented.');
  }
}

describe(`[${RepeatInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new RepeatInstruction([], 2);

    expect(instruction).not.toBeInstanceOf(MergeableInstructionBase);
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
      const instructionToRepeat = new ErroredWriteTestInstruction();
      const instruction = new RepeatInstruction([instructionToRepeat], 1);
      const tab = new Tab();

      instructionToRepeat.writeOnTab = jest.fn(instructionToRepeat.writeOnTab);
      const writeResult = instruction.writeOnTab(tab);

      expect(instructionToRepeat.writeOnTab).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionBaseReason.UnmappedReason);
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
