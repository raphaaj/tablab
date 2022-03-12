export enum NumberType {
  Integer = 'Integer',
  Decimal = 'Decimal',
}

export class NumberHelper {
  static getNumberType(number: number): NumberType {
    let numberType = NumberType.Decimal;

    if (Number.isInteger(number)) numberType = NumberType.Integer;

    return numberType;
  }
}
