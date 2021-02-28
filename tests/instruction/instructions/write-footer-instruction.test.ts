import { Tab } from '../../../src/tab/tab';
import { WriteFooterInstruction } from '../../../src/instruction/instructions/write-footer-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';

describe(`[${WriteFooterInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new WriteFooterInstruction('test footer');

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  it('should write the footer to the tab on write', () => {
    const footer = 'test footer';
    const instruction = new WriteFooterInstruction(footer);
    const tab = new Tab();

    tab.writeFooter = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeFooter).toHaveBeenCalledWith(footer);
  });
});
