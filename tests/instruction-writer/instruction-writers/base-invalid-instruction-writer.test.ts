import { BaseInvalidInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-invalid-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { Tab } from '../../../src/tab/tab';

describe(`[${BaseInvalidInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const reasonIdentifier = 'TEST_INVALID_INSTRUCTION_REASON';
    const description = 'test invalid instruction description';

    const instructionWriter = new BaseInvalidInstructionWriter({
      reasonIdentifier,
      description,
    });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should return a failed write result with the given reason identifier', () => {
      const reasonIdentifier = 'TEST_INVALID_INSTRUCTION_REASON';
      const description = 'test invalid instruction description';
      const tab = new Tab();

      const instructionWriter = new BaseInvalidInstructionWriter({
        reasonIdentifier,
        description,
      });

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.failureMessage).toBe(description);
      expect(writeResult.failureReasonIdentifier).toBe(reasonIdentifier);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
