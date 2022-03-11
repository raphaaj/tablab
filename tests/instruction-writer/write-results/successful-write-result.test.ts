import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { SuccessfulWriteResult } from '../../../src/instruction-writer/write-results/successful-write-result';
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

describe(`[${SuccessfulWriteResult.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a success write result', () => {
      const tab = new Tab();
      const parsedInstruction = getTestParsedInstruction();
      const instructionWriter = new NullInstructionWriter({ parsedInstruction });

      const baseWriteResult = new SuccessfulWriteResult({
        instructionWriter,
        tab,
      });

      expect(baseWriteResult.failureMessage).toBe(null);
      expect(baseWriteResult.failureReasonIdentifier).toBe(null);
      expect(baseWriteResult.instructionWriter).toBe(instructionWriter);
      expect(baseWriteResult.success).toBe(true);
      expect(baseWriteResult.tab).toBe(tab);
    });
  });
});
