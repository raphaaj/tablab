import { NumberHelper, NumberType } from '../../src/helpers/number-helper';

describe(`[${NumberHelper.name}]`, () => {
  it('should return the integer number type for integer numbers', () => {
    const number = 1;

    const numberType = NumberHelper.getNumberType(number);

    expect(numberType).toBe(NumberType.Integer);
  });

  it('should return the decimal number type for decimal numbers', () => {
    const number = 1.14;

    const numberType = NumberHelper.getNumberType(number);

    expect(numberType).toBe(NumberType.Decimal);
  });
});
