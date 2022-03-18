import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(): ParsedInstructionData {
  const instruction = 'testInstruction';

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

class TestInstructionWriter extends BaseInstructionWriter {
  internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

describe(`[${BaseInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the parsedInstruction field with the given parsedInstruction value', () => {
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new TestInstructionWriter({ parsedInstruction });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
    });
  });

  describe('[writeOnTab]', () => {
    it('should return the result of internalWriteOnTab on success', () => {
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new TestInstructionWriter({ parsedInstruction });
      const tab = new Tab();

      const expectedResult = new BaseWriteResult({
        instructionWriter,
        success: true,
        tab,
      });

      const internalWriteOnTabSpy = jest
        .spyOn(instructionWriter, 'internalWriteOnTab')
        .mockImplementation(() => expectedResult);

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(internalWriteOnTabSpy).toHaveBeenCalled();
      expect(writeResult).toBe(expectedResult);

      internalWriteOnTabSpy.mockRestore();
    });

    it('should return a failed write result on error', () => {
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new TestInstructionWriter({ parsedInstruction });
      const tab = new Tab();

      const internalWriteOnTabSpy = jest
        .spyOn(instructionWriter, 'internalWriteOnTab')
        .mockImplementation(() => {
          throw new Error('test');
        });

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(internalWriteOnTabSpy).toHaveBeenCalled();
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBeDefined();
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);

      internalWriteOnTabSpy.mockRestore();
    });
  });
});
