import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

class NullInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

function getTestParsedInstruction(): ParsedInstructionData {
  const instruction = '1-0';

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${BaseWriteResult.name}]`, () => {
  describe('[constructor]', () => {
    it('should allow the creation of a success write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const success = true;

      const baseWriteResult = new BaseWriteResult({
        success,
        instructionWriter,
        tab,
      });

      expect(baseWriteResult.failureMessage).toBe(null);
      expect(baseWriteResult.failureReasonIdentifier).toBe(null);
      expect(baseWriteResult.instructionWriter).toBe(instructionWriter);
      expect(baseWriteResult.success).toBe(success);
      expect(baseWriteResult.tab).toBe(tab);
    });

    it('should allow the creation of a failed write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const failureReasonIdentifier = 'TEST_FAILURE_REASON';
      const failureMessage = 'test failure message';
      const success = false;

      const baseWriteResult = new BaseWriteResult({
        success,
        failureMessage,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });

      expect(baseWriteResult.failureMessage).toBe(failureMessage);
      expect(baseWriteResult.failureReasonIdentifier).toBe(failureReasonIdentifier);
      expect(baseWriteResult.instructionWriter).toBe(instructionWriter);
      expect(baseWriteResult.success).toBe(success);
      expect(baseWriteResult.tab).toBe(tab);
    });

    it('should throw when no failure reason identifier is set on the creation of a failed write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const success = false;

      expect(
        () =>
          new BaseWriteResult({
            success,
            instructionWriter,
            tab,
          })
      ).toThrow();
    });
  });
});
