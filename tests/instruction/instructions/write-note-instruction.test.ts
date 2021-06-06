import { WriteNoteInstruction } from '../../../src/instruction/instructions/write-note-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';

describe(`[${WriteNoteInstruction.name}]`, () => {
  it('should be a mergeable instruction', () => {
    const instruction = new WriteNoteInstruction(new Note(1, '1'));

    expect(instruction).toBeInstanceOf(MergeableInstruction);
  });

  describe('[writeOnTab]', () => {
    it('should write note to the tab on write, returning a success write result', () => {
      const noteToWrite = new Note(1, '1/2');
      const instruction = new WriteNoteInstruction(noteToWrite);
      const tab = new Tab();

      tab.writeNote = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeNote).toHaveBeenCalledWith(noteToWrite);
      expect(writeResult.success).toBe(true);
    });

    it('should return a failed write result on error', () => {
      const noteToWrite = new Note(1, '1/2');
      const instruction = new WriteNoteInstruction(noteToWrite);
      const tab = new Tab();

      tab.writeNote = jest.fn(() => {
        throw new Error();
      });
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeNote).toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(InvalidInstructionReason.UnmappedReason);
    });

    it(`should return a failed write result when the note's string is out of tab range`, () => {
      const noteToWrite = new Note(0, '1/2');
      const instruction = new WriteNoteInstruction(noteToWrite);
      const tab = new Tab();

      tab.writeNote = jest.fn();
      const writeResult = instruction.writeOnTab(tab);

      expect(tab.writeNote).not.toHaveBeenCalled();
      expect(writeResult.success).toBe(false);
      expect(writeResult.failureReasonIdentifier).toBe(
        InvalidInstructionReason.WriteNoteInstructionWithNonWritableNote
      );
    });
  });
});
