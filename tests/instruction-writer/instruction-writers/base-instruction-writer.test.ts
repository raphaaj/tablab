import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

class TestInstructionWriter extends BaseInstructionWriter {
  internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

describe(`[${BaseInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should allow the creation of an instruction writer without the parsed instruction data ', () => {
      const instructionWriter = new TestInstructionWriter();

      expect(instructionWriter.parsedInstruction).toBe(null);
    });

    it('should allow the creation of an instruction writer with the parsed instruction data ', () => {
      const instruction = '1-0';
      const parsedInstruction: ParsedInstructionData = {
        method: null,
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = new TestInstructionWriter({ parsedInstruction });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
    });
  });

  describe('[writeOnTab]', () => {
    it('should return the result of internalWriteOnTab on success', () => {
      const instructionWriter = new TestInstructionWriter();
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
      const instructionWriter = new TestInstructionWriter();
      const tab = new Tab();

      const internalWriteOnTabSpy = jest
        .spyOn(instructionWriter, 'internalWriteOnTab')
        .mockImplementation(() => {
          throw new Error('test');
        });

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(internalWriteOnTabSpy).toHaveBeenCalled();
      expect(writeResult.failureMessage).toBeDefined();
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);

      internalWriteOnTabSpy.mockRestore();
    });
  });
});
