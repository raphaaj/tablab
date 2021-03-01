import { MethodResult } from '../../src/parser/method-result';
import { ParserResult } from '../../src/parser/parser-result';

describe(`[${MethodResult.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the method result properties', () => {
      const alias = 'test';
      const args = ['arg1', 123, 'arg2', 321];
      const targets = [] as ParserResult[];

      const methodResult = new MethodResult({
        alias,
        args,
        targets,
      });

      expect(methodResult.alias).toBe(alias);
      expect(methodResult.args).toBe(args);
      expect(methodResult.targets).toBe(targets);
    });
  });

  describe('[extractMethodAlias]', () => {
    it('should return the method alias if the instruction is a method instruction', () => {
      const alias = 'test';
      const instruction = `${alias} ( arg1, arg2 ) { 1-0 2-0 3-0 }`;

      const methodAlias = MethodResult.extractMethodAlias(instruction);

      expect(methodAlias).toBe(alias);
    });

    it('should return null if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const methodAlias = MethodResult.extractMethodAlias(instruction);

      expect(methodAlias).toBe(null);
    });
  });

  describe('[extractMethodArguments]', () => {
    it('should return all the method arguments if the instruction is a method instruction with arguments', () => {
      const args = [0, 'arg1', 'arg2', 3];
      const instruction = `test (${args.join(', ')})`;

      const methodArguments = MethodResult.extractMethodArguments(instruction, '(', ',');

      expect(methodArguments).toEqual(args);
    });

    it('should return an empty array if the instruction is a method without arguments', () => {
      const instruction = 'test';

      const methodArguments = MethodResult.extractMethodArguments(instruction, '(', ',');

      expect(methodArguments.length).toBe(0);
    });

    it('should return an empty array if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const methodArguments = MethodResult.extractMethodArguments(instruction, '(', ',');

      expect(methodArguments.length).toBe(0);
    });
  });

  describe('[extractMethodTarget]', () => {
    it('should return the method target if the instruction is a method instruction with target', () => {
      const target = ' 1-0 2-0 3-0 ';
      const instruction = `test {${target}}`;

      const methodTargetExtractionResult = MethodResult.extractMethodTarget(instruction, '{');

      expect(methodTargetExtractionResult?.target).toBe(target);
      expect(methodTargetExtractionResult?.indexAtInstruction).toBe(instruction.indexOf(target));
    });

    it('should return null if the instruction is a method instruction without target', () => {
      const instruction = 'test';

      const methodTargetExtractionResult = MethodResult.extractMethodTarget(instruction, '{');

      expect(methodTargetExtractionResult).toBe(null);
    });

    it('should return null if the instruction is not a method instruction', () => {
      const instruction = '1-0';

      const methodTargetExtractionResult = MethodResult.extractMethodTarget(instruction, '{');

      expect(methodTargetExtractionResult).toBe(null);
    });
  });
});
