import { ParsedMethodInstruction } from './parsed-method-instruction-result';
import { InstructionData, InstructionProvider } from '../instruction/instruction-factory-base';
import { Tab } from '../tab';
import { InstructionWriteResult } from '../instruction';

/**
 * The data of an instruction extracted from a string of instructions.
 */
export interface ParsedInstruction {
  /**
   * The method data of the extracted instruction. Available only if the extracted
   * instruction is a method instruction, null otherwise.
   */
  method: ParsedMethodInstruction | null;

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

  /**
   * Writes the extracted instruction to a given tablature.
   * @param tab - The tablature on which the instruction should be written.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): InstructionWriteResult;
}

export type ParsedInstructionResultData = {
  instructionProvider: InstructionProvider;
  method: ParsedMethodInstruction | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;
};

export class ParsedInstructionResult implements ParsedInstruction, InstructionData {
  instructionProvider: InstructionProvider;
  method: ParsedMethodInstruction | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;

  constructor({
    instructionProvider,
    method,
    readFromIndex,
    readToIndex,
    value,
  }: ParsedInstructionResultData) {
    this.instructionProvider = instructionProvider;
    this.method = method;
    this.readFromIndex = readFromIndex;
    this.readToIndex = readToIndex;
    this.value = value;
  }

  writeOnTab(tab: Tab): InstructionWriteResult {
    const instructionToWrite = this.instructionProvider.getInstruction(this);
    return instructionToWrite.writeOnTab(tab);
  }
}
