import { MergeInstruction } from '../../../src/instruction/instructions/merge-instruction';
import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { WriteNoteInstruction } from '../../../src/instruction/instructions/write-note-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';

describe(`[${MergeInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new MergeInstruction([]);

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  it('should write in parallel the given mergeable instructions on tab on write', () => {
    const tab = new Tab();
    const notesToWrite = [new Note(1, '0'), new Note(2, '0')];
    const instructionsToMerge = notesToWrite.map((note) => new WriteNoteInstruction(note));
    const instruction = new MergeInstruction(instructionsToMerge);

    tab.writeParallelNotes = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeParallelNotes).toHaveBeenCalledWith(notesToWrite);
  });
});
