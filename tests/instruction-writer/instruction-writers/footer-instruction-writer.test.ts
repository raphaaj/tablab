import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { FooterInstructionWriter } from '../../../src/instruction-writer/instruction-writers/footer-instruction-writer';
import { Tab } from '../../../src/tab/tab';

describe(`[${FooterInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const instructionWriter = new FooterInstructionWriter({ footer: 'test footer' });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should write the footer to the tab on write, returning a success write result', () => {
      const footer = 'test footer';
      const instructionWriter = new FooterInstructionWriter({ footer });
      const tab = new Tab();

      tab.writeFooter = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeFooter).toHaveBeenCalledWith(footer);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
