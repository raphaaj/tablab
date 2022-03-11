import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { HeaderInstructionWriter } from '../../../src/instruction-writer/instruction-writers/header-instruction-writer';
import { Tab } from '../../../src/tab/tab';

describe(`[${HeaderInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const instructionWriter = new HeaderInstructionWriter({ header: 'test header' });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should write the header to the tab on write, returning a success write result', () => {
      const header = 'test header';
      const instructionWriter = new HeaderInstructionWriter({ header });
      const tab = new Tab();

      tab.writeHeader = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeHeader).toHaveBeenCalledWith(header);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
