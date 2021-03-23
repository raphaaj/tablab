import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class WriteHeaderInstruction extends InstructionBase {
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
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      tab.writeHeader(this.header);

      result = new SuccessInstructionWriteResult();
    } catch (e) {
      result = this.getUnmappepFailureResult();
    }

    return result;
  }
}
