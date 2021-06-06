import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class BreakInstruction extends Instruction {
  /**
   * Creates a break instruction instance.
   */
  constructor() {
    super();
  }

  /**
   * Adds a tablature block to given tablature.
   * @param tab - The tablature to add a block.
   * @returns The result of the writing operation.
   */
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
