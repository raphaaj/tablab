import { MergeInstruction } from '../../../src/instruction/instructions/merge-instruction';
import { MergeableInstructionBase } from '../../../src/instruction/core/mergeable-instruction-base';
import { WriteNoteInstruction } from '../../../src/instruction/core/write-note-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionBaseReason } from '../../../src/instruction/core/enums/invalid-instruction-base-reason';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${MergeInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new MergeInstruction([]);

    expect(instruction).not.toBeInstanceOf(MergeableInstructionBase);
  });

  describe('[writeOnTab]', () => {
    it('should write in parallel the given mergeable instructions on tab on write, returning a success write result', () => {
      const notesToWrite = [new Note(1, '0'), new Note(2, '0')];
      const instructionsToMerge = notesToWrite.map((note) => new WriteNoteInstruction(note));
      const instruction = new MergeInstruction(instructionsToMerge);
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeParallelNotes).toHaveBeenCalledWith(notesToWrite);
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const instructionsToMerge = [] as WriteNoteInstruction[];
      const instruction = new MergeInstruction(instructionsToMerge);
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn(() => {
        throw new Error();
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeParallelNotes).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionBaseReason.UnmappedReason);
    });

    it('should return a failed write result when the instructions to merge have strings out of tab range', () => {
      const notesToWrite = [new Note(0, '0')];
      const instructionsToMerge = notesToWrite.map((note) => new WriteNoteInstruction(note));
      const instruction = new MergeInstruction(instructionsToMerge);
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeParallelNotes).not.toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionTargetsWithStringOutOfTabRange
      );
    });
  });
});
