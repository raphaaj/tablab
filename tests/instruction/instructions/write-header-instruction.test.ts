import { WriteHeaderInstruction } from '../../../src/instruction/instructions/write-header-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${WriteHeaderInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new WriteHeaderInstruction('test header');

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
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
      const errorMessage = 'header: an unexpected error occurred';
      const instruction = new WriteHeaderInstruction('');
      const tab = new Tab();

      tab.writeHeader = jest.fn(() => {
        throw new Error(errorMessage);
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeHeader).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnknownReason);
      expect(writeResult.failureMessage).toContain(errorMessage);
    });
  });
});
