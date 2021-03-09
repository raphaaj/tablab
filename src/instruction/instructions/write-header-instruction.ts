import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class WriteHeaderInstruction extends InstructionBase {
  readonly header: string;

  constructor(header: string) {
    super();

    this.header = header;
  }

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
