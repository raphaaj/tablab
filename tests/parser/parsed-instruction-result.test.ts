import { ParsedInstructionResult } from '../../src/parser/parsed-instruction-result';
import { ParsedMethodInstructionResult } from '../../src/parser/parsed-method-instruction-result';
import { Instruction } from '../../src/instruction/instructions/instruction';
import { InstructionProvider } from '../../src/instruction/instruction-factory-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../../src/instruction/instruction-write-result';
import { Tab } from '../../src/tab/tab';

class NullInstruction extends Instruction {
  writeOnTab(): InstructionWriteResult {
    return new SuccessInstructionWriteResult();
  }
}

class NullInstructionProvider implements InstructionProvider {
  getInstruction(): Instruction {
    return new NullInstruction();
  }
}

const getParsedInstructionResultForNonMethodInstruction = () => {
  const value = '1-0';

  const parsedInstruction = new ParsedInstructionResult({
    instructionProvider: new NullInstructionProvider(),
    method: null,
    readFromIndex: 0,
    readToIndex: value.length - 1,
    value: value,
  });

  return { value, parsedInstruction };
};

const getParsedInstructionResultForMethodInstruction = () => {
  const parsedMethodInstruction = new ParsedMethodInstructionResult({
    alias: 'testAlias',
    identifier: 'testIdentifier',
    args: [],
    targets: [],
  });

  const value = parsedMethodInstruction.alias;

  const parsedInstruction = new ParsedInstructionResult({
    instructionProvider: new NullInstructionProvider(),
    method: parsedMethodInstruction,
    readFromIndex: 0,
    readToIndex: value.length - 1,
    value: value,
  });

  return { value, parsedMethodInstruction, parsedInstruction };
};

describe(`[${ParsedInstructionResult.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the parsed instruction properties for a non method instruction', () => {
      const { value, parsedInstruction } = getParsedInstructionResultForNonMethodInstruction();

      expect(parsedInstruction.value).toBe(value);
      expect(parsedInstruction.method).toBe(null);
    });

    it('should set the parsed instruction properties for a method instruction', () => {
      const {
        value,
        parsedMethodInstruction,
        parsedInstruction,
      } = getParsedInstructionResultForMethodInstruction();

      expect(parsedInstruction.value).toBe(value);
      expect(parsedInstruction.method).toEqual(parsedMethodInstruction);
    });
  });

  describe('[writeOnTab]', () => {
    it('should write the parsed instruction to the given tab for a non method instruction', () => {
      const tab = new Tab();
      const testInstruction = new NullInstruction();
      const { parsedInstruction } = getParsedInstructionResultForNonMethodInstruction();

      testInstruction.writeOnTab = jest.fn();
      parsedInstruction.instructionProvider.getInstruction = jest.fn(() => testInstruction);

      parsedInstruction.writeOnTab(tab);

      expect(testInstruction.writeOnTab).toHaveBeenCalledWith(tab);
    });

    it('should write the parsed instruction to the given tab for a method instruction', () => {
      const tab = new Tab();
      const testInstruction = new NullInstruction();
      const { parsedInstruction } = getParsedInstructionResultForMethodInstruction();

      testInstruction.writeOnTab = jest.fn();
      parsedInstruction.instructionProvider.getInstruction = jest.fn(() => testInstruction);

      parsedInstruction.writeOnTab(tab);

      expect(testInstruction.writeOnTab).toHaveBeenCalledWith(tab);
    });
  });
});
