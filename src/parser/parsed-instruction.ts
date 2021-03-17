import { ParsedMethodInstructionData } from './parsed-method-instruction';
import { InstructionData } from '../instruction/core/instruction-factory-base';

export interface ParsedInstructionData {
  method: ParsedMethodInstructionData | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;
}

export class ParsedInstruction implements ParsedInstructionData, InstructionData {
  method: ParsedMethodInstructionData | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;

  constructor({ value, readFromIndex, readToIndex, method }: ParsedInstructionData) {
    this.value = value;
    this.readFromIndex = readFromIndex;
    this.readToIndex = readToIndex;
    this.method = method;
  }
}
