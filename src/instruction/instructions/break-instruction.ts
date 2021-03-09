import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class BreakInstruction extends InstructionBase {
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      tab.addBlock();
      result = new SuccessInstructionWriteResult();
    } catch (e) {
      result = this.getUnmappepFailureResult();
    }

    return result;
  }
}
