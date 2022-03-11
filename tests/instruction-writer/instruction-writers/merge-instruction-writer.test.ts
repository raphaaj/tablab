import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { MergeInstructionWriter } from '../../../src/instruction-writer/instruction-writers/merge-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { Note } from '../../../src/tab/note';
import { Tab } from '../../../src/tab/tab';

class TestMergeableInstructionWriter extends MergeableInstructionWriter {
  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

describe(`[${MergeInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const instructionWriter = new MergeInstructionWriter({ instructionWritersToMerge: [] });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should write in parallel the given mergeable instructions on tab on write, returning a success write result', () => {
      const notesToMerge = [new Note(1, '0'), new Note(2, '0')];
      const instructionWritersToMerge = notesToMerge.map(
        (note) => new TestMergeableInstructionWriter({ note })
      );
      const instructionWriter = new MergeInstructionWriter({ instructionWritersToMerge });
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeParallelNotes).toHaveBeenCalledWith(notesToMerge);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });

    it('should return a failed write result when the instructions to merge have strings out of tab range', () => {
      const notesToWrite = [new Note(0, '0')];
      const instructionWritersToMerge = notesToWrite.map(
        (note) => new TestMergeableInstructionWriter({ note })
      );
      const instructionWriter = new MergeInstructionWriter({ instructionWritersToMerge });
      const tab = new Tab();

      tab.writeParallelNotes = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeParallelNotes).not.toHaveBeenCalled();
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
