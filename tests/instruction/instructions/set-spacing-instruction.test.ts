import { MergeableInstructionBase } from '../../../src/instruction/core/mergeable-instruction-base';
import { SetSpacingInstruction } from '../../../src/instruction/instructions/set-spacing-instruction';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionBaseReason } from '../../../src/instruction/core/enums/invalid-instruction-base-reason';

describe(`[${SetSpacingInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new SetSpacingInstruction(1);

    expect(instruction).not.toBeInstanceOf(MergeableInstructionBase);
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
      const spacing = 0;
      const instruction = new SetSpacingInstruction(spacing);
      const tab = new Tab();

      const writeResult = instruction.writeOnTab(tab);

      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionBaseReason.UnmappedReason);
    });
  });
});
