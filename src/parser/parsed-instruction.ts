import { InstructionWriterProvider } from '../instruction-writer/factories/base-instruction-writer-factory';
import { BaseWriteResult } from '../instruction-writer/write-results/base-write-result';
import { Tab } from '../tab/tab';
import { ParsedMethodInstruction } from './parsed-method-instruction';

/**
 * The data of a parsed instruction.
 */
export interface ParsedInstructionData {
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
}

/**
 * The options to create a parsed instruction.
 */
export type ParsedInstructionOptions = {
  instructionWriterProvider: InstructionWriterProvider;
  method: ParsedMethodInstruction | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;
};

/**
 * A parsed instruction.
 */
export class ParsedInstruction implements ParsedInstructionData {
  method: ParsedMethodInstruction | null;
  readFromIndex: number;
  readToIndex: number;
  value: string;

  private _instructionWriterProvider: InstructionWriterProvider;

  constructor({
    instructionWriterProvider,
    method,
    readFromIndex,
    readToIndex,
    value,
  }: ParsedInstructionOptions) {
    this._instructionWriterProvider = instructionWriterProvider;
    this.method = method;
    this.readFromIndex = readFromIndex;
    this.readToIndex = readToIndex;
    this.value = value;
  }

  /**
   * Writes the parsed instruction to the given tablature.
   * @param tab - The tablature to write the parsed instruction.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): BaseWriteResult {
    const instructionWriter = this._instructionWriterProvider.getInstructionWriter(this);
    return instructionWriter.writeOnTab(tab);
  }
}
