import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { SetSpacingInstruction } from '../../../src/instruction/instructions/set-spacing-instruction';
import { Tab } from '../../../src/tab/tab';

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
  });
});
