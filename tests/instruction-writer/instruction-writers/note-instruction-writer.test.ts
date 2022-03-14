import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { NoteInstructionWriter } from '../../../src/instruction-writer/instruction-writers/note-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(note: Note): ParsedInstructionData {
  const instruction = `${note.string}-${note.fret}`;

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${NoteInstructionWriter.name}]`, () => {
  it('should be a mergeable instruction writer', () => {
    const note = new Note(1, '1');
    const parsedInstruction = getTestParsedInstruction(note);
    const instructionWriter = new NoteInstructionWriter({ parsedInstruction, note });

    expect(instructionWriter).toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should write note to the tab on write, returning a success write result', () => {
      const note = new Note(1, '1/2');
      const parsedInstruction = getTestParsedInstruction(note);
      const instructionWriter = new NoteInstructionWriter({ parsedInstruction, note });
      const tab = new Tab();

      tab.writeNote = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeNote).toHaveBeenCalledWith(note);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });

    it(`should return a failed write result when the note's string is out of tab range`, () => {
      const note = new Note(0, '1/2');
      const parsedInstruction = getTestParsedInstruction(note);
      const instructionWriter = new NoteInstructionWriter({ parsedInstruction, note });
      const tab = new Tab();

      tab.writeNote = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeNote).not.toHaveBeenCalled();
      expect(writeResult.failureMessage).toBeDefined();
      expect(writeResult.failureReasonIdentifier).toBe(
        InvalidInstructionReason.BasicInstructionWithNonWritableNote
      );
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
