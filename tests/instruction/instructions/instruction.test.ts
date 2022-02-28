import {
  FailedInstructionWriteResult,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../../../src/instruction/instruction-write-result';
import { Instruction } from '../../../src/instruction/instructions/instruction';
import { Tab } from '../../../src/tab/tab';

class TestInstruction extends Instruction {
  internalWriteOnTab(): InstructionWriteResult {
    throw new Error('Method not implemented.');
  }
}

describe(`[${Instruction.name}]`, () => {
  describe('[writeOnTab]', () => {
    it('should return the result of internalWriteOnTab on succes', () => {
      const testInstruction = new TestInstruction();
      const expectedResult = new SuccessInstructionWriteResult();
      const tab = new Tab();

      const internalWriteOnTabSpy = jest
        .spyOn(testInstruction, 'internalWriteOnTab')
        .mockImplementation(() => expectedResult);

      const writeOnTabWriteResult = testInstruction.writeOnTab(tab);

      expect(internalWriteOnTabSpy).toHaveBeenCalled();
      expect(writeOnTabWriteResult).toBe(expectedResult);

      internalWriteOnTabSpy.mockRestore();
    });

    it('should return a failed instruction write result on error', () => {
      const testInstruction = new TestInstruction();
      const tab = new Tab();

      const internalWriteOnTabSpy = jest.spyOn(testInstruction, 'internalWriteOnTab');

      const writeOnTabWriteResult = testInstruction.writeOnTab(tab);

      expect(internalWriteOnTabSpy).toHaveBeenCalled();
      expect(writeOnTabWriteResult).toBeInstanceOf(FailedInstructionWriteResult);

      internalWriteOnTabSpy.mockRestore();
    });
  });
});
