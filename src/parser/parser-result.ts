import { MethodResult } from './method-result';

export type ParserResultData = {
  methodResult: MethodResult | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;
};

export class ParserResult {
  get isMethod(): boolean {
    return this.method !== null;
  }

  method: MethodResult | null = null;
  readFromIndex: number;
  readToIndex: number;
  value: string;

  constructor({ value, readFromIndex, readToIndex, methodResult }: ParserResultData) {
    this.value = value;
    this.readFromIndex = readFromIndex;
    this.readToIndex = readToIndex;
    this.method = methodResult;
  }
}
