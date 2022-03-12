import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { RepeatInstructionWriter } from '../../../src/instruction-writer/instruction-writers/repeat-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { FailedWriteResult } from '../../../src/instruction-writer/write-results/failed-write-result';
import { SuccessfulWriteResult } from '../../../src/instruction-writer/write-results/successful-write-result';
import { Tab } from '../../../src/tab/tab';

class SuccessfulWriteTestInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}

class FailedWriteTestInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new FailedWriteResult({
      failureMessage: 'test failure message',
      failureReasonIdentifier: 'TEST_FAILURE_REASON_IDENTIFIER',
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
    it('should repeatedly write the instruction writers to repeat on write, returning a success write result', () => {
      const numberOfRepetitions = 3;
      const instructionWritersToRepeat = [
        new SuccessfulWriteTestInstructionWriter(),
        new SuccessfulWriteTestInstructionWriter(),
      ];
      const instructionWriter = new RepeatInstructionWriter({
        instructionWritersToRepeat,
        numberOfRepetitions,
      });
      const tab = new Tab();

      const writeResultsOfTheInstructionWritersToRepeat = instructionWritersToRepeat.map(
        (instructionWriter) => instructionWriter.writeOnTab(tab)
      );

      instructionWritersToRepeat.forEach(
        (instructionWriter) =>
          (instructionWriter.writeOnTab = jest.fn(instructionWriter.writeOnTab))
      );
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.childResults).toEqual(writeResultsOfTheInstructionWritersToRepeat);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);

      instructionWritersToRepeat.forEach((instructionWriter) => {
        expect(instructionWriter.writeOnTab).toHaveBeenCalledTimes(numberOfRepetitions);

        for (let i = 0; i < numberOfRepetitions; i++) {
          expect(instructionWriter.writeOnTab).toHaveBeenNthCalledWith(i + 1, tab);
        }
      });
    });

    it('should return a failed write result when all the instruction writers to repeat fails to be written on tab', () => {
      const numberOfRepetitions = 3;
      const instructionWritersToRepeat = [
        new FailedWriteTestInstructionWriter(),
        new FailedWriteTestInstructionWriter(),
      ];
      const instructionWriter = new RepeatInstructionWriter({
        instructionWritersToRepeat,
        numberOfRepetitions,
      });
      const tab = new Tab();

      const writeResultsOfTheInstructionWritersToRepeat = instructionWritersToRepeat.map(
        (instructionWriter) => instructionWriter.writeOnTab(tab)
      );

      instructionWritersToRepeat.forEach(
        (instructionWriter) =>
          (instructionWriter.writeOnTab = jest.fn(instructionWriter.writeOnTab))
      );
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.childResults).toEqual(writeResultsOfTheInstructionWritersToRepeat);
      expect(writeResult.failureMessage).toBeDefined();
      expect(writeResult.failureReasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidTargets
      );
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);

      instructionWritersToRepeat.forEach((instructionWriter) => {
        expect(instructionWriter.writeOnTab).toHaveBeenCalledTimes(numberOfRepetitions);

        for (let i = 0; i < numberOfRepetitions; i++) {
          expect(instructionWriter.writeOnTab).toHaveBeenNthCalledWith(i + 1, tab);
        }
      });
    });

    it('should return a failed write result when any of the instruction writers to repeat fails to be written on tab', () => {
      const numberOfRepetitions = 3;
      const instructionWritersToRepeat = [
        new SuccessfulWriteTestInstructionWriter(),
        new FailedWriteTestInstructionWriter(),
        new SuccessfulWriteTestInstructionWriter(),
      ];
      const instructionWriter = new RepeatInstructionWriter({
        instructionWritersToRepeat,
        numberOfRepetitions,
      });
      const tab = new Tab();

      const writeResultsOfTheInstructionWritersToRepeat = instructionWritersToRepeat.map(
        (instructionWriter) => instructionWriter.writeOnTab(tab)
      );

      instructionWritersToRepeat.forEach(
        (instructionWriter) =>
          (instructionWriter.writeOnTab = jest.fn(instructionWriter.writeOnTab))
      );
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(writeResult.childResults).toEqual(writeResultsOfTheInstructionWritersToRepeat);
      expect(writeResult.failureMessage).toBeDefined();
      expect(writeResult.failureReasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidTargets
      );
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(false);
      expect(writeResult.tab).toBe(tab);

      instructionWritersToRepeat.forEach((instructionWriter) => {
        expect(instructionWriter.writeOnTab).toHaveBeenCalledTimes(numberOfRepetitions);

        for (let i = 0; i < numberOfRepetitions; i++) {
          expect(instructionWriter.writeOnTab).toHaveBeenNthCalledWith(i + 1, tab);
        }
      });
    });
  });
});
