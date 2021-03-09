import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class WriteFooterInstruction extends InstructionBase {
  readonly footer: string;

  constructor(footer: string) {
    super();

    this.footer = footer;
  }

  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      tab.writeFooter(this.footer);

      result = new SuccessInstructionWriteResult();
    } catch (e) {
      result = this.getUnmappepFailureResult();
    }

    return result;
  }
}
