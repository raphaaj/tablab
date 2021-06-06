import { ParsedMethodInstructionData } from './parsed-method-instruction';
import { InstructionData } from '../instruction/instruction-factory-base';

/**
 * The data of an instruction extracted from a string of instructions.
 */
export interface ParsedInstructionData {
  /**
   * The method data of the extracted instruction. Available only if the extracted
   * instruction is a method instruction, null otherwise.
   */
  method: ParsedMethodInstructionData | null;

  /**
   * The beginning index of the extracted instruction at the original instructions
   * string.
   */
  readFromIndex: number;

  /**
   * The end index of the extracted instruction at the original instructions string.
   */
  readToIndex: number;

  /**
   * The extracted instruction value.
   */
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
