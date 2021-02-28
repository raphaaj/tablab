import { WriteNoteInstruction } from '../../../src/instruction/instructions/write-note-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';

describe(`[${WriteNoteInstruction.name}]`, () => {
  it('should be a mergeable instruction', () => {
    const instruction = new WriteNoteInstruction(new Note(1, '1'));

    expect(instruction).toBeInstanceOf(MergeableInstruction);
  });

  it('should write note to the tab on write', () => {
    const tab = new Tab();
    const noteToWrite = new Note(1, '1/2');
    const instruction = new WriteNoteInstruction(noteToWrite);

    tab.writeNote = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeNote).toHaveBeenCalledWith(noteToWrite);
  });
});
