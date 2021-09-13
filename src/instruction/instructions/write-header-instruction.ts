import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class WriteHeaderInstruction extends Instruction {
  readonly header: string;

  /**
   * Creates a write header instruction instance.
   * @param header - The header to be written.
   */
  constructor(header: string) {
    super();

    this.header = header;
  }

  /**
   * Writes the `header` to the tablature.
   * @param tab - The tablature to write the header.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): InstructionWriteResult {
    tab.writeHeader(this.header);

    return new SuccessInstructionWriteResult();
  }
}
