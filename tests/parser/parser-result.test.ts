import { MethodResult } from '../../src/parser/method-result';
import { ParserResult } from '../../src/parser/parser-result';

const getTestNonMethodInstructionParserResult = () => {
  const value = '1-0';

  const parserResult = new ParserResult({
    value: value,
    readFromIndex: 0,
    readToIndex: value.length - 1,
    methodResult: null,
  });

  return { value, parserResult };
};

const getTestMethodInstructionParserResult = () => {
  const methodResult = new MethodResult({
    alias: 'testAlias',
    identifier: 'testIdentifier',
    args: [],
    targets: [],
  });

  const value = methodResult.alias;

  const parserResult = new ParserResult({
    value: value,
    readFromIndex: 0,
    readToIndex: value.length - 1,
    methodResult: methodResult,
  });

  return { value, methodResult, parserResult };
};

describe(`[${ParserResult.name}]`, () => {
  describe('[constructor]', () => {
    it('should set the result properties when it is not a method instruction result', () => {
      const { value, parserResult } = getTestNonMethodInstructionParserResult();

      expect(parserResult.value).toBe(value);
      expect(parserResult.method).toBe(null);
    });

    it('should set the result properties when it is a method instruction result', () => {
      const { value, methodResult, parserResult } = getTestMethodInstructionParserResult();

      expect(parserResult.value).toBe(value);
      expect(parserResult.method).toEqual(methodResult);
    });
  });

  describe('[properties]', () => {
    describe('[isMethod]', () => {
      it('should be true when it is a method instruction result', () => {
        const { parserResult } = getTestMethodInstructionParserResult();

        expect(parserResult.isMethod).toBe(true);
      });

      it('should be false when it is not a method instruction result', () => {
        const { parserResult } = getTestNonMethodInstructionParserResult();

        expect(parserResult.isMethod).toBe(false);
      });
    });
  });

  describe('[asInstructionMethodData]', () => {
    it('should return a valid instruction data structure when it is a method instruction result', () => {
      const { value, methodResult, parserResult } = getTestMethodInstructionParserResult();

      const instructionData = parserResult.asInstructionData();

      expect(instructionData.value).toBe(value);
      expect(instructionData.method).toEqual(methodResult?.asInstructionMethodData());
    });

    it('should return a valid instruction data structure when it is not a method instruction result', () => {
      const { value, parserResult } = getTestNonMethodInstructionParserResult();

      const instructionData = parserResult.asInstructionData();

      expect(instructionData.value).toBe(value);
      expect(instructionData.method).toBe(null);
    });
  });
});
