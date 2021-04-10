import { ParsedMethodInstruction } from '../../src/parser/parsed-method-instruction';
import { ParsedInstruction } from '../../src/parser/parsed-instruction';
import { Enclosure } from '../../src/helpers/enclosures-helper';

const getTestParsedMethodInstruction = (identifier: string | null) => {
  const alias = 'testAlias';
  const args = ['arg1', '123', 'arg2', '321'];

  const targetValue = '1-0';
  const targets = [
    new ParsedInstruction({
      value: targetValue,
      method: null,
      readFromIndex: 0,
      readToIndex: targetValue.length - 1,
    }),
  ];

  const parsedMethodInstruction = new ParsedMethodInstruction({
    alias,
    args,
    targets,
    identifier,
  });

  return {
    alias,
    args,
    targets,
    parsedMethodInstruction,
  };
};

const getIdentifiedTestParsedMethodInstruction = () => {
  const identifier = 'testIdentifier';
  const parsedMethodInstruction = getTestParsedMethodInstruction(identifier);

  return {
    ...parsedMethodInstruction,
    identifier,
  };
};

const getNonIdentifiedTestParsedMethodInstruction = () => {
  const parsedMethodInstruction = getTestParsedMethodInstruction(null);

  return parsedMethodInstruction;
};

describe(`[${ParsedMethodInstruction.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the parsed method instruction properties when the identifier is given', () => {
      const {
        parsedMethodInstruction,
        alias,
        identifier,
        args,
        targets,
      } = getIdentifiedTestParsedMethodInstruction();

      expect(parsedMethodInstruction.alias).toBe(alias);
      expect(parsedMethodInstruction.identifier).toBe(identifier);
      expect(parsedMethodInstruction.args).toBe(args);
      expect(parsedMethodInstruction.targets).toBe(targets);
    });

    it('should set the parsed method instruction properties when no identifier is given', () => {
      const {
        parsedMethodInstruction,
        alias,
        args,
        targets,
      } = getNonIdentifiedTestParsedMethodInstruction();

      expect(parsedMethodInstruction.alias).toBe(alias);
      expect(parsedMethodInstruction.identifier).toBe(null);
      expect(parsedMethodInstruction.args).toBe(args);
      expect(parsedMethodInstruction.targets).toBe(targets);
    });
  });

  describe('[extractMethodAlias]', () => {
    it('should return the method alias if the instruction is a method instruction', () => {
      const alias = 'test';
      const instruction = `${alias} ( arg1, arg2 ) { 1-0 2-0 3-0 }`;

      const methodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(methodAlias).toBe(alias);
    });

    it('should return null if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const methodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(methodAlias).toBe(null);
    });
  });

  describe('[extractMethodArguments]', () => {
    it('should return all the method arguments if the instruction is a method instruction with arguments', () => {
      const args = ['0', 'arg1', 'arg2', '3'];
      const instruction = `test (${args.join(', ')})`;

      const methodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        Enclosure.Parentheses,
        ','
      );

      expect(methodArguments).toEqual(args);
    });

    it('should return an empty array if the instruction is a method instruction without arguments', () => {
      const instruction = 'test';

      const methodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        Enclosure.Parentheses,
        ','
      );

      expect(methodArguments.length).toBe(0);
    });

    it('should return an empty array if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const methodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        Enclosure.Parentheses,
        ','
      );

      expect(methodArguments.length).toBe(0);
    });
  });

  describe('[extractMethodTarget]', () => {
    it('should return the method instruction target if the instruction is a method instruction with target', () => {
      const target = ' 1-0 2-0 3-0 ';
      const instruction = `test {${target}}`;

      const methodTargetExtractionResult = ParsedMethodInstruction.extractMethodTarget(
        instruction,
        Enclosure.CurlyBrackets
      );

      expect(methodTargetExtractionResult?.target).toBe(target);
      expect(methodTargetExtractionResult?.readFromIndex).toBe(instruction.indexOf(target));
    });

    it('should return null if the instruction is a method instruction without target', () => {
      const instruction = 'test';

      const methodTargetExtractionResult = ParsedMethodInstruction.extractMethodTarget(
        instruction,
        Enclosure.CurlyBrackets
      );

      expect(methodTargetExtractionResult).toBe(null);
    });

    it('should return null if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const methodTargetExtractionResult = ParsedMethodInstruction.extractMethodTarget(
        instruction,
        Enclosure.CurlyBrackets
      );

      expect(methodTargetExtractionResult).toBe(null);
    });
  });
});
