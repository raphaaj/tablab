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
    it('should allow the creation of a successful write result without child results', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const success = true;

      const writeResult = new BaseWriteResult({
        instructionWriter,
        success,
        tab,
      });

      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(success);
      expect(writeResult.tab).toBe(tab);
    });

    it('should allow the creation of a successful write result with child results', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const success = true;

      const childResult = new BaseWriteResult({
        instructionWriter,
        success,
        tab,
      });

      const writeResult = new BaseWriteResult({
        childResults: [childResult],
        instructionWriter,
        success,
        tab,
      });

      expect(writeResult.childResults).toEqual([childResult]);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(success);
      expect(writeResult.tab).toBe(tab);
    });

    it('should allow the creation of a failed write result without child results', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const failureReasonIdentifier = 'TEST_FAILURE_REASON';
      const failureMessage = 'test failure message';
      const success = false;

      const writeResult = new BaseWriteResult({
        failureMessage,
        failureReasonIdentifier,
        instructionWriter,
        success,
        tab,
      });

      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(failureMessage);
      expect(writeResult.failureReasonIdentifier).toBe(failureReasonIdentifier);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(success);
      expect(writeResult.tab).toBe(tab);
    });

    it('should allow the creation of a failed write result with child results', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const failureReasonIdentifier = 'TEST_FAILURE_REASON';
      const failureMessage = 'test failure message';
      const success = false;

      const childResult = new BaseWriteResult({
        failureMessage,
        failureReasonIdentifier,
        instructionWriter,
        success,
        tab,
      });

      const writeResult = new BaseWriteResult({
        childResults: [childResult],
        failureMessage,
        failureReasonIdentifier,
        instructionWriter,
        success,
        tab,
      });

      expect(writeResult.childResults).toEqual([childResult]);
      expect(writeResult.failureMessage).toBe(failureMessage);
      expect(writeResult.failureReasonIdentifier).toBe(failureReasonIdentifier);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(success);
      expect(writeResult.tab).toBe(tab);
    });

    it('should throw when a failure reason identifier is set on the creation of a successful write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const failureReasonIdentifier = 'TEST_FAILURE_REASON';
      const success = true;

      expect(
        () =>
          new BaseWriteResult({
            failureReasonIdentifier,
            instructionWriter,
            success,
            tab,
          })
      ).toThrow();
    });

    it('should throw when no failure reason identifier is set on the creation of a failed write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const success = false;

      expect(
        () =>
          new BaseWriteResult({
            instructionWriter,
            success,
            tab,
          })
      ).toThrow();
    });
  });
});
