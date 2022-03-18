import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { MergeInstructionWriter } from '../../../src/instruction-writer/instruction-writers/merge-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';

function getTestMergeableParsedInstruction(
  note: Note,
  parentInstruction?: string
): ParsedInstructionData {
  const instruction = `${note.string}-${note.fret}`;

  const startRefIndex = parentInstruction ? parentInstruction.indexOf(instruction) : 0;

  return {
    method: null,
    readFromIndex: startRefIndex,
    readToIndex: startRefIndex + instruction.length,
    value: instruction,
  };
}

function getTestMergeParsedInstruction(notes: Note[]): ParsedInstructionData {
  const alias = 'merge';
  const targets = notes.map((note) => `${note.string}-${note.fret}`);
  const instruction = `${alias} {${targets.join(' ')}}`;

  const parsedTargets = notes.map((note) => getTestMergeableParsedInstruction(note, instruction));

  return {
    method: {
      alias,
      identifier: MethodInstruction.Merge,
      args: [],
      targets: parsedTargets,
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

class TestMergeableInstructionWriter extends MergeableInstructionWriter {
  constructor(note: Note) {
    super({ note, parsedInstruction: getTestMergeableParsedInstruction(note) });
  }

  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

describe(`[${MergeInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a merge instruction writer as expected', () => {
      const notesToMerge = [new Note(1, '0'), new Note(2, '0')];
      const parsedInstruction = getTestMergeParsedInstruction(notesToMerge);

      const instructionWritersToMerge = notesToMerge.map(
        (note) => new TestMergeableInstructionWriter(note)
      );

      const instructionWriter = new MergeInstructionWriter({
        parsedInstruction,
        instructionWritersToMerge,
      });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.instructionWritersToMerge).toBe(instructionWritersToMerge);
    });

    it('should not be a mergeable instruction writer', () => {
      const notesToMerge = [new Note(1, '0'), new Note(2, '0')];
      const parsedInstruction = getTestMergeParsedInstruction(notesToMerge);

      const instructionWritersToMerge = notesToMerge.map(
        (note) => new TestMergeableInstructionWriter(note)
      );

      const instructionWriter = new MergeInstructionWriter({
        parsedInstruction,
        instructionWritersToMerge,
      });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should write in parallel the given mergeable instructions on tab on write, returning a success write result', () => {
      const notesToMerge = [new Note(1, '0'), new Note(2, '0')];
      const parsedInstruction = getTestMergeParsedInstruction(notesToMerge);

      const instructionWritersToMerge = notesToMerge.map(
        (note) => new TestMergeableInstructionWriter(note)
      );

      const instructionWriter = new MergeInstructionWriter({
        parsedInstruction,
        instructionWritersToMerge,
      });
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeParallelNotes).toHaveBeenCalledWith(notesToMerge);
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });

    it('should return a failed write result when the instructions to merge have strings out of tab range', () => {
      const notesToMerge = [new Note(0, '0')];
      const parsedInstruction = getTestMergeParsedInstruction(notesToMerge);

      const instructionWritersToMerge = notesToMerge.map(
        (note) => new TestMergeableInstructionWriter(note)
      );

      const instructionWriter = new MergeInstructionWriter({
        parsedInstruction,
        instructionWritersToMerge,
      });
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeParallelNotes).not.toHaveBeenCalled();
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBeDefined();
      expect(writeResult.failureReasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes
      );
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
