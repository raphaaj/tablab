import { Enclosure } from '../../src/helpers/enclosures-helper';
import { ParsedInstruction } from '../../src/parser/parsed-instruction';
import { ParsedMethodInstruction } from '../../src/parser/parsed-method-instruction';

describe(`[${ParsedMethodInstruction.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the parsed method instruction properties when the identifier is given', () => {
      const alias = 'testAlias';
      const identifier = 'testIdentifier';
      const args: string[] = [];
      const targets: ParsedInstruction[] = [];

      const parsedMethodInstruction = new ParsedMethodInstruction({
        alias,
        identifier,
        args,
        targets,
      });

      expect(parsedMethodInstruction.alias).toBe(alias);
      expect(parsedMethodInstruction.identifier).toBe(identifier);
      expect(parsedMethodInstruction.args).toBe(args);
      expect(parsedMethodInstruction.targets).toBe(targets);
    });

    it('should set the parsed method instruction properties when no identifier is given', () => {
      const alias = 'testAlias';
      const identifier = null;
      const args: string[] = [];
      const targets: ParsedInstruction[] = [];

      const parsedMethodInstruction = new ParsedMethodInstruction({
        alias,
        identifier,
        args,
        targets,
      });

      expect(parsedMethodInstruction.alias).toBe(alias);
      expect(parsedMethodInstruction.identifier).toBe(identifier);
      expect(parsedMethodInstruction.args).toBe(args);
      expect(parsedMethodInstruction.targets).toBe(targets);
    });
  });

  describe('[extractMethodAlias]', () => {
    it('should return the method alias if the instruction is a method instruction with no arguments and no targets', () => {
      const alias = 'testAlias';

      const instruction = alias;

      const extractedMethodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(extractedMethodAlias).toBe(alias);
    });

    it('should return the method alias if the instruction is a method instruction with arguments and no targets', () => {
      const alias = 'testAlias';
      const args = ['arg1', 'arg2'];

      const instruction = `${alias} (${args.join(',')})`;

      const extractedMethodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(extractedMethodAlias).toBe(alias);
    });

    it('should return the method alias if the instruction is a method instruction with targets and no arguments', () => {
      const alias = 'testAlias';
      const targets = ['1-0', '2-0'];

      const instruction = `${alias} {${targets.join(',')}}`;

      const extractedMethodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(extractedMethodAlias).toBe(alias);
    });

    it('should return the method alias if the instruction is a method instruction with both arguments and targets', () => {
      const alias = 'testAlias';
      const args = ['arg1', 'arg2'];
      const targets = ['1-0', '2-0'];

      const instruction = `${alias} (${args.join(',')}) {${targets.join(',')}}`;

      const extractedMethodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(extractedMethodAlias).toBe(alias);
    });

    it('should return null if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const extractedMethodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);

      expect(extractedMethodAlias).toBe(null);
    });
  });

  describe('[extractMethodArguments]', () => {
    it('should return all the method arguments if the instruction is a method instruction with arguments', () => {
      const alias = 'testAlias';
      const args = ['0', 'arg1', 'arg2', '3'];

      const instruction = `${alias} (${args.join(',')})`;

      const extractedMethodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        Enclosure.Parentheses,
        ','
      );

      expect(extractedMethodArguments).toEqual(args);
    });

    it('should return an empty array if the instruction is a method instruction without arguments', () => {
      const instruction = 'testAlias';

      const extractedMethodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        Enclosure.Parentheses,
        ','
      );

      expect(extractedMethodArguments.length).toBe(0);
    });

    it('should return an empty array if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const extractedMethodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        Enclosure.Parentheses,
        ','
      );

      expect(extractedMethodArguments.length).toBe(0);
    });
  });

  describe('[extractMethodTarget]', () => {
    it('should return the method instruction target if the instruction is a method instruction with target', () => {
      const alias = 'testAlias';
      const targets = ['1-0', '2-0'];
      const target = ` ${targets.join(' ')} `;

      const instruction = `${alias} {${target}}`;

      const extractedMethodTarget = ParsedMethodInstruction.extractMethodTarget(
        instruction,
        Enclosure.CurlyBrackets
      );

      expect(extractedMethodTarget?.target).toBe(target);
      expect(extractedMethodTarget?.readFromIndex).toBe(instruction.indexOf(target));
    });

    it('should return null if the instruction is a method instruction without target', () => {
      const instruction = 'testAlias';

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
