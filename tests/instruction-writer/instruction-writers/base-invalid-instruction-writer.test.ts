import { BaseInvalidInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-invalid-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(): ParsedInstructionData {
  const instruction = '0-0';

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${BaseInvalidInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a base invalid instruction writer as expected', () => {
      const reasonIdentifier = 'TEST_INVALID_INSTRUCTION_REASON';
      const description = 'test invalid instruction description';
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier,
        description,
      });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.reasonIdentifier).toBe(reasonIdentifier);
      expect(instructionWriter.description).toBe(description);
    });

    it('should not be a mergeable instruction writer', () => {
      const reasonIdentifier = 'TEST_INVALID_INSTRUCTION_REASON';
      const description = 'test invalid instruction description';
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier,
        description,
      });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should return a failed write result with the given reason identifier', () => {
      const reasonIdentifier = 'TEST_INVALID_INSTRUCTION_REASON';
      const description = 'test invalid instruction description';
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier,
        description,
      });
      const tab = new Tab();

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(description);
      expect(writeResult.failureReasonIdentifier).toBe(reasonIdentifier);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
