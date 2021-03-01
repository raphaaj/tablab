import { MethodResult } from '../../src/parser/method-result';
import { ParserResult } from '../../src/parser/parser-result';

const getTestParserResult = ({ setMethodResult }: { setMethodResult: boolean }) => {
  const methodResult = new MethodResult({
    alias: 'test',
    args: [],
    targets: [],
  });

  return new ParserResult({
    value: 'test',
    readFromIndex: 0,
    readToIndex: 3,
    methodResult: setMethodResult ? methodResult : null,
  });
};

describe(`[${ParserResult.name}]`, () => {
  describe('[properties]', () => {
    describe('[isMethod]', () => {
      it('should be true if the method result is set', () => {
        const parserResult = getTestParserResult({ setMethodResult: true });

        expect(parserResult.isMethod).toBe(true);
      });

      it('should be false if the method result is not set', () => {
        const parserResult = getTestParserResult({ setMethodResult: false });

        expect(parserResult.isMethod).toBe(false);
      });
    });
  });
});
