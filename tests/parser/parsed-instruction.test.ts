import { ParsedMethodInstruction } from '../../src/parser/parsed-method-instruction';
import { ParsedInstruction } from '../../src/parser/parsed-instruction';

const getTestParsedInstructionForNonMethodInstruction = () => {
  const value = '1-0';

  const parsedInstruction = new ParsedInstruction({
    value: value,
    readFromIndex: 0,
    readToIndex: value.length - 1,
    method: null,
  });

  return { value, parsedInstruction };
};

const getTestParsedInstructionForMethodInstruction = () => {
  const parsedMethodInstruction = new ParsedMethodInstruction({
    alias: 'testAlias',
    identifier: 'testIdentifier',
    args: [],
    targets: [],
  });

  const value = parsedMethodInstruction.alias;

  const parsedInstruction = new ParsedInstruction({
    value: value,
    readFromIndex: 0,
    readToIndex: value.length - 1,
    method: parsedMethodInstruction,
  });

  return { value, parsedMethodInstruction, parsedInstruction };
};

describe(`[${ParsedInstruction.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the parsed instruction properties for a non method instruction', () => {
      const { value, parsedInstruction } = getTestParsedInstructionForNonMethodInstruction();

      expect(parsedInstruction.value).toBe(value);
      expect(parsedInstruction.method).toBe(null);
    });

    it('should set the parsed instruction properties for a method instruction', () => {
      const {
        value,
        parsedMethodInstruction,
        parsedInstruction,
      } = getTestParsedInstructionForMethodInstruction();

      expect(parsedInstruction.value).toBe(value);
      expect(parsedInstruction.method).toEqual(parsedMethodInstruction);
    });
  });
});
