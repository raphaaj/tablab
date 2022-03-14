import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { RepeatInstructionWriter } from '../../../src/instruction-writer/instruction-writers/repeat-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { FailedWriteResult } from '../../../src/instruction-writer/write-results/failed-write-result';
import { SuccessfulWriteResult } from '../../../src/instruction-writer/write-results/successful-write-result';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestUnrepeatableParsedInstruction(): ParsedInstructionData {
  const instruction = `0-0`;

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

function getTestRepeatableParsedInstruction(): ParsedInstructionData {
  const instruction = `1-0`;

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

function getTestRepeatParsedInstruction(
  instructionWritersToRepeat: BaseInstructionWriter[]
): ParsedInstructionData {
  const parsedTargets = instructionWritersToRepeat.map(
    (instructionWriterToRepeat) => instructionWriterToRepeat.parsedInstruction
  );

  const alias = 'repeat';
  const targets = parsedTargets.map((parsedTarget) => parsedTarget.value);
  const instruction = `${alias} {${targets.join(' ')}}`;

  return {
    method: {
      alias,
      identifier: MethodInstruction.Repeat,
      args: [],
      targets: parsedTargets,
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

class SuccessfulWriteTestInstructionWriter extends BaseInstructionWriter {
  constructor() {
    super({ parsedInstruction: getTestRepeatableParsedInstruction() });
  }

  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}

class FailedWriteTestInstructionWriter extends BaseInstructionWriter {
  constructor() {
    super({ parsedInstruction: getTestUnrepeatableParsedInstruction() });
  }

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
  describe('[constructor]', () => {
    it('should create a repeat instruction writer as expected', () => {
      const numberOfRepetitions = 2;
      const instructionWritersToRepeat: BaseInstructionWriter[] = [];
      const parsedInstruction = getTestRepeatParsedInstruction(instructionWritersToRepeat);

      const instructionWriter = new RepeatInstructionWriter({
        parsedInstruction,
        instructionWritersToRepeat,
        numberOfRepetitions,
      });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.instructionWritersToRepeat).toBe(instructionWritersToRepeat);
      expect(instructionWriter.numberOfRepetitions).toBe(numberOfRepetitions);
    });

    it('should not be a mergeable instruction writer', () => {
      const numberOfRepetitions = 2;
      const instructionWritersToRepeat: BaseInstructionWriter[] = [];
      const parsedInstruction = getTestRepeatParsedInstruction(instructionWritersToRepeat);

      const instructionWriter = new RepeatInstructionWriter({
        parsedInstruction,
        instructionWritersToRepeat,
        numberOfRepetitions,
      });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should repeatedly write the instruction writers to repeat on write, returning a success write result', () => {
      const numberOfRepetitions = 3;
      const instructionWritersToRepeat = [
        new SuccessfulWriteTestInstructionWriter(),
        new SuccessfulWriteTestInstructionWriter(),
      ];
      const parsedInstruction = getTestRepeatParsedInstruction(instructionWritersToRepeat);

      const instructionWriter = new RepeatInstructionWriter({
        parsedInstruction,
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
      const parsedInstruction = getTestRepeatParsedInstruction(instructionWritersToRepeat);

      const instructionWriter = new RepeatInstructionWriter({
        parsedInstruction,
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
      const parsedInstruction = getTestRepeatParsedInstruction(instructionWritersToRepeat);

      const instructionWriter = new RepeatInstructionWriter({
        parsedInstruction,
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
