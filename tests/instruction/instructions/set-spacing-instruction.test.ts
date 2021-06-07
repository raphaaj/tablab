import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { SetSpacingInstruction } from '../../../src/instruction/instructions/set-spacing-instruction';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${SetSpacingInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new SetSpacingInstruction(1);

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  describe('[writeOnTab]', () => {
    it('should set the tab rows spacing on write, returning a success write result', () => {
      const spacing = 10;
      const instruction = new SetSpacingInstruction(spacing);
      const tab = new Tab();

      const writeResult = instruction.writeOnTab(tab);

      expect(tab.spacing).toBe(spacing);
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const errorMessage = 'spacing: an unexpected error occurred';
      const instruction = new SetSpacingInstruction(1);
      const tab = new Tab();

      tab.setSpacing = jest.fn(() => {
        throw new Error(errorMessage);
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.setSpacing).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.failureMessage).toContain(errorMessage);
    });
  });
});
