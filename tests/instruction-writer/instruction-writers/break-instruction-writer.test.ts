import { BreakInstructionWriter } from '../../../src/instruction-writer/instruction-writers/break-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { Tab } from '../../../src/tab/tab';

describe(`[${BreakInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const instructionWriter = new BreakInstructionWriter();

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should add a tab block to the tab on write, returning a success write result', () => {
      const instructionWriter = new BreakInstructionWriter();
      const tab = new Tab();

      tab.addBlock = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.addBlock).toHaveBeenCalled();
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
