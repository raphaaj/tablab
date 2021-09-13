import { BreakInstruction } from '../../../src/instruction/instructions/break-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Tab } from '../../../src/tab/tab';

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
  });
});
