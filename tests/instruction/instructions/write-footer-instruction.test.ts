import { WriteFooterInstruction } from '../../../src/instruction/instructions/write-footer-instruction';
import { MergeableInstructionBase } from '../../../src/instruction/core/mergeable-instruction-base';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${WriteFooterInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new WriteFooterInstruction('test footer');

    expect(instruction).not.toBeInstanceOf(MergeableInstructionBase);
  });

  describe('[writeOnTab]', () => {
    it('should write the footer to the tab on write, returning a success write result', () => {
      const footer = 'test footer';
      const instruction = new WriteFooterInstruction(footer);
      const tab = new Tab();

      tab.writeFooter = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeFooter).toHaveBeenCalledWith(footer);
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const footer = '';
      const instruction = new WriteFooterInstruction(footer);
      const tab = new Tab();

      tab.writeFooter = jest.fn(() => {
        throw new Error();
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeFooter).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnmappedReason);
    });
  });
});
