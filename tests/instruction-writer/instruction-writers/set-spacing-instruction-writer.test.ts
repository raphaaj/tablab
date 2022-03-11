import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { SetSpacingInstructionWriter } from '../../../src/instruction-writer/instruction-writers/set-spacing-instruction-writer';
import { Tab } from '../../../src/tab/tab';

describe(`[${SetSpacingInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const instructionWriter = new SetSpacingInstructionWriter({ spacing: 1 });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should set the tab rows spacing on write, returning a success write result', () => {
      const spacing = 10;
      const instructionWriter = new SetSpacingInstructionWriter({ spacing });
      const tab = new Tab();

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.spacing).toBe(spacing);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
