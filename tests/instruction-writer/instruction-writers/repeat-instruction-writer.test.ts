import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { RepeatInstructionWriter } from '../../../src/instruction-writer/instruction-writers/repeat-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { FailedWriteResult } from '../../../src/instruction-writer/write-results/failed-write-result';
import { SuccessfulWriteResult } from '../../../src/instruction-writer/write-results/successful-write-result';
import { Tab } from '../../../src/tab/tab';

class SuccessWriteTestInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}

class FailedWriteTestInstructionWriter extends BaseInstructionWriter {
  constructor(public failureReasonIdentifier: string) {
    super();
  }

  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new FailedWriteResult({
      failureMessage: 'test failure message',
      failureReasonIdentifier: this.failureReasonIdentifier,
      instructionWriter: this,
      tab,
    });
  }
}

describe(`[${RepeatInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const instructionWriter = new RepeatInstructionWriter({
      instructionWritersToRepeat: [],
      numberOfRepetitions: 2,
    });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it('should repeatedly write the instructions to repeat on write, returning a success write result', () => {
      const numberOfRepetitions = 3;
      const instructionWritersToRepeat = [
        new SuccessWriteTestInstructionWriter(),
        new SuccessWriteTestInstructionWriter(),
      ];
      const instructionWriter = new RepeatInstructionWriter({
        instructionWritersToRepeat,
        numberOfRepetitions,
      });
      const tab = new Tab();

      instructionWritersToRepeat.forEach(
        (instructionWriter) =>
          (instructionWriter.writeOnTab = jest.fn(instructionWriter.writeOnTab))
      );
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);

      instructionWritersToRepeat.forEach((instruction) => {
        expect(instruction.writeOnTab).toHaveBeenCalledTimes(numberOfRepetitions);

        for (let i = 0; i < numberOfRepetitions; i++) {
          expect(instruction.writeOnTab).toHaveBeenNthCalledWith(i + 1, tab);
        }
      });
    });

    it('should return a failed write result when all the instructions to repeat fails to be written on tab', () => {
      const numberOfRepetitions = 3;
      const failedWriteReasonIdentifier = 'TEST_REASON';
      const instructionWritersToRepeat = [
        new FailedWriteTestInstructionWriter(failedWriteReasonIdentifier),
        new FailedWriteTestInstructionWriter(failedWriteReasonIdentifier),
      ];
      const instructionWriter = new RepeatInstructionWriter({
        instructionWritersToRepeat,
        numberOfRepetitions,
      });
      const tab = new Tab();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.failureReasonIdentifier).toBe(failedWriteReasonIdentifier);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);
    });

    it('should return a failed write result when any of the instructions to repeat fails to be written on tab', () => {
      const numberOfRepetitions = 3;
      const failedWriteReasonIdentifier = 'TEST_REASON';
      const instructionWritersToRepeat = [
        new SuccessWriteTestInstructionWriter(),
        new FailedWriteTestInstructionWriter(failedWriteReasonIdentifier),
        new SuccessWriteTestInstructionWriter(),
      ];
      const instructionWriter = new RepeatInstructionWriter({
        instructionWritersToRepeat,
        numberOfRepetitions,
      });
      const tab = new Tab();

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.failureReasonIdentifier).toBe(failedWriteReasonIdentifier);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
