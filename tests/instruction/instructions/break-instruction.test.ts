import { BreakInstruction } from '../../../src/instruction/instructions/break-instruction';
import { MergeableInstructionBase } from '../../../src/instruction/core/mergeable-instruction-base';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionBaseReason } from '../../../src/instruction/core/enums/invalid-instruction-base-reason';

describe(`[${BreakInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new BreakInstruction();

    expect(instruction).not.toBeInstanceOf(MergeableInstructionBase);
  });

  describe('[writeOnTab]', () => {
    it('should add a tab block to the tab on write, returning a success write result', () => {
      const instruction = new BreakInstruction();
      const tab = new Tab();

      tab.addBlock = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.addBlock).toHaveBeenCalled();
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const instruction = new BreakInstruction();
      const tab = new Tab();

      tab.addBlock = jest.fn(() => {
        throw new Error();
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.addBlock).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionBaseReason.UnmappedReason);
    });
  });
});
