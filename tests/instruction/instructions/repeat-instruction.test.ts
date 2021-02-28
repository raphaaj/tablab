import { MergeableInstruction } from '../../../src/instruction/instructions/mergeable-instruction';
import { RepeatInstruction } from '../../../src/instruction/instructions/repeat-instruction';
import { WriteNoteInstruction } from '../../../src/instruction/instructions/write-note-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';

describe(`[${RepeatInstruction.name}]`, () => {
  it('should not be a mergeable instruction', () => {
    const instruction = new RepeatInstruction([], 2);

    expect(instruction).not.toBeInstanceOf(MergeableInstruction);
  });

  it('should repeatedly write the instructions to repeat on write', () => {
    const repetitions = 3;
    const instructionsToRepeat = [
      new WriteNoteInstruction(new Note(1, '0')),
      new WriteNoteInstruction(new Note(2, '0')),
    ];
    const instruction = new RepeatInstruction(instructionsToRepeat, repetitions);
    const tab = new Tab();

    tab.writeNote = jest.fn();
    instruction.writeOnTab(tab);

    expect(tab.writeNote).toHaveBeenCalledTimes(repetitions * instructionsToRepeat.length);
    instructionsToRepeat.forEach((instruction, instructionIdx) => {
      for (let i = 0; i < repetitions; i++) {
        expect(tab.writeNote).toHaveBeenNthCalledWith(
          instructionIdx + instructionsToRepeat.length * i + 1,
          instruction.note
        );
      }
    });
  });
});
