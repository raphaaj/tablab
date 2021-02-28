import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { WriteHeaderInstruction } from '../../../src/instruction/instructions/write-header-instruction';
import { Tab } from '../../../src/tab/tab';

describe(`[${WriteHeaderInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new WriteHeaderInstruction('test header');

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  it('should write the header to the tab on write', () => {
    const header = 'test header';
    const instruction = new WriteHeaderInstruction(header);
    const tab = new Tab();

    tab.writeHeader = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeHeader).toHaveBeenCalledWith(header);
  });
});
