import { WriteHeaderInstruction } from '../../../src/instruction/instructions/write-header-instruction';
import { MergeableInstructionBase } from '../../../src/instruction/core/mergeable-instruction-base';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionBaseReason } from '../../../src/instruction/core/enums/invalid-instruction-base-reason';

describe(`[${WriteHeaderInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new WriteHeaderInstruction('test header');

    expect(instruction).not.toBeInstanceOf(MergeableInstructionBase);
  });

  describe('[writeOnTab]', () => {
    it('should write the header to the tab on write, returning a success write result', () => {
      const header = 'test header';
      const instruction = new WriteHeaderInstruction(header);
      const tab = new Tab();

      tab.writeHeader = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeHeader).toHaveBeenCalledWith(header);
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const header = '';
      const instruction = new WriteHeaderInstruction(header);
      const tab = new Tab();

      tab.writeHeader = jest.fn(() => {
        throw new Error();
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeHeader).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionBaseReason.UnmappedReason);
    });
  });
});
