import { BreakInstruction } from '../../../src/instruction/instructions/break-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Tab } from '../../../src/tab/tab';

describe(`[${BreakInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new BreakInstruction();

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  it('add a tab block to the tab on write', () => {
    const tab = new Tab();
    const instruction = new BreakInstruction();

    tab.addBlock = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.addBlock).toHaveBeenCalled();
  });
});
