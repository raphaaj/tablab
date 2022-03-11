import { BaseInstructionWriter } from '../../src//instruction-writer/instruction-writers/base-instruction-writer';
import { InstructionWriterProvider } from '../../src/instruction-writer/factories/base-instruction-writer-factory';
import { BaseWriteResult } from '../../src/instruction-writer/write-results/base-write-result';
import { SuccessfulWriteResult } from '../../src/instruction-writer/write-results/successful-write-result';
import { ParsedInstruction, ParsedInstructionData } from '../../src/parser/parsed-instruction';
import { ParsedMethodInstruction } from '../../src/parser/parsed-method-instruction';
import { Tab } from '../../src/tab/tab';

class NullInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(tab: Tab): BaseWriteResult {
    return new SuccessfulWriteResult({ instructionWriter: this, tab });
  }
}

class NullInstructionWriterProvider implements InstructionWriterProvider {
  getInstructionWriter(parsedInstruction: ParsedInstructionData): BaseInstructionWriter {
    return new NullInstructionWriter({ parsedInstruction });
  }
}

class SingleInstructionProvider implements InstructionWriterProvider {
  instructionWriter: BaseInstructionWriter;
  constructor(instructionWriter: BaseInstructionWriter) {
    this.instructionWriter = instructionWriter;
  }

  getInstructionWriter(): BaseInstructionWriter {
    return this.instructionWriter;
  }
}

describe(`[${ParsedInstruction.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the parsed instruction properties for a non method instruction', () => {
      const instruction = '1-0';

      const parsedInstruction = new ParsedInstruction({
        instructionWriterProvider: new NullInstructionWriterProvider(),
        method: null,
        readFromIndex: 0,
        readToIndex: instruction.length - 1,
        value: instruction,
      });

      expect(parsedInstruction.value).toBe(instruction);
      expect(parsedInstruction.method).toBe(null);
    });

    it('should set the parsed instruction properties for a method instruction', () => {
      const methodInstructionAlias = 'testAlias';
      const methodInstructionIdentifier = 'testIdentifier';

      const instruction = methodInstructionAlias;

      const parsedMethodInstruction = new ParsedMethodInstruction({
        alias: methodInstructionAlias,
        identifier: methodInstructionIdentifier,
        args: [],
        targets: [],
      });

      const parsedInstruction = new ParsedInstruction({
        instructionWriterProvider: new NullInstructionWriterProvider(),
        method: parsedMethodInstruction,
        readFromIndex: 0,
        readToIndex: instruction.length - 1,
        value: instruction,
      });

      expect(parsedInstruction.value).toBe(instruction);
      expect(parsedInstruction.method).toEqual(parsedMethodInstruction);
    });
  });

  describe('[writeOnTab]', () => {
    it('should write the parsed instruction to the given tab for a non method instruction', () => {
      const tab = new Tab();
      const instruction = '1-0';

      const parsedInstructionData: ParsedInstructionData = {
        method: null,
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = new NullInstructionWriter({
        parsedInstruction: parsedInstructionData,
      });

      const instructionWriterProvider = new SingleInstructionProvider(instructionWriter);

      const parsedInstruction = new ParsedInstruction({
        instructionWriterProvider: instructionWriterProvider,
        ...parsedInstructionData,
      });

      instructionWriter.writeOnTab = jest.fn();
      parsedInstruction.writeOnTab(tab);

      expect(instructionWriter.writeOnTab).toHaveBeenCalledWith(tab);
    });

    it('should write the parsed instruction to the given tab for a method instruction', () => {
      const tab = new Tab();
      const methodInstructionAlias = 'testAlias';
      const methodInstructionIdentifier = 'testIdentifier';

      const instruction = methodInstructionAlias;

      const parsedMethodInstruction = new ParsedMethodInstruction({
        alias: methodInstructionAlias,
        identifier: methodInstructionIdentifier,
        args: [],
        targets: [],
      });

      const parsedInstructionData: ParsedInstructionData = {
        method: parsedMethodInstruction,
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = new NullInstructionWriter({
        parsedInstruction: parsedInstructionData,
      });

      const instructionWriterProvider = new SingleInstructionProvider(instructionWriter);

      const parsedInstruction = new ParsedInstruction({
        instructionWriterProvider: instructionWriterProvider,
        ...parsedInstructionData,
      });

      instructionWriter.writeOnTab = jest.fn();
      parsedInstruction.writeOnTab(tab);

      expect(instructionWriter.writeOnTab).toHaveBeenCalledWith(tab);
    });
  });
});
