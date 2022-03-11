import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { FailedWriteResult } from '../../../src/instruction-writer/write-results/failed-write-result';
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

describe(`[${FailedWriteResult.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a failed write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });
      const failureReasonIdentifier = 'TEST_FAILURE_REASON';
      const failureMessage = 'test failure message';

      const baseWriteResult = new FailedWriteResult({
        failureMessage,
        failureReasonIdentifier,
        instructionWriter,
        tab,
      });

      expect(baseWriteResult.failureMessage).toBe(failureMessage);
      expect(baseWriteResult.failureReasonIdentifier).toBe(failureReasonIdentifier);
      expect(baseWriteResult.instructionWriter).toBe(instructionWriter);
      expect(baseWriteResult.success).toBe(false);
      expect(baseWriteResult.tab).toBe(tab);
    });
  });
});
