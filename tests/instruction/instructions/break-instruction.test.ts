import { BreakInstruction } from '../../../src/instruction/instructions/break-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${BreakInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new BreakInstruction();

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
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
      const errorMessage = 'break: an unexpected error occurred';
      const instruction = new BreakInstruction();
      const tab = new Tab();

      tab.addBlock = jest.fn(() => {
        throw new Error(errorMessage);
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.addBlock).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.failureMessage).toContain(errorMessage);
    });
  });
});
