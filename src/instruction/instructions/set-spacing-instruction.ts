import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class SetSpacingInstruction extends Instruction {
  readonly spacing: number;

  /**
   * Creates a set spacing instruction instance.
   * @param spacing - The spacing value to be set.
   */
  constructor(spacing: number) {
    super();

    this.spacing = spacing;
  }

  /**
   * Sets the spacing of the tablature to the `spacing` value.
   * @param tab - The tablature to set the spacing.
   * @returns The result of the writing operation.
   */
  writeOnTab(tab: Tab): InstructionWriteResult {
    let result: InstructionWriteResult;

    try {
      tab.setSpacing(this.spacing);

      result = new SuccessInstructionWriteResult();
    } catch (e) {
      result = this.getFailureResultOnError(e);
    }

    return result;
  }
}
