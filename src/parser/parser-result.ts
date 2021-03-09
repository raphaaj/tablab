import { MethodResult } from './method-result';
import { InstructionData } from '../instruction/core/instruction-factory-base';

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

  method: MethodResult | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;

  constructor({ value, readFromIndex, readToIndex, methodResult }: ParserResultData) {
    this.value = value;
    this.readFromIndex = readFromIndex;
    this.readToIndex = readToIndex;
    this.method = methodResult;
  }

  asInstructionData(): InstructionData {
    return {
      value: this.value,
      method: this.method ? this.method.asInstructionMethodData() : null,
    };
  }
}
