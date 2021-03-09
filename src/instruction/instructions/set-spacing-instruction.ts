import { Tab } from '../../tab/tab';
import { InstructionBase } from '../core/instruction-base';
import {
  InstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../core/instruction-write-result';

export class SetSpacingInstruction extends InstructionBase {
  readonly spacing: number;

  constructor(spacing: number) {
    super();

    this.spacing = spacing;
  }

  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      tab.spacing = this.spacing;

      result = new SuccessInstructionWriteResult();
    } catch (e) {
      result = this.getUnmappepFailureResult();
    }

    return result;
  }
}
