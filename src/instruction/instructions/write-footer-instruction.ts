import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';
import { InstructionWriteResult, SuccessInstructionWriteResult } from '../instruction-write-result';

export class WriteFooterInstruction extends Instruction {
  readonly footer: string;

  /**
   * Creates a write footer instruction instance.
   * @param footer - The footer to be written.
   */
  constructor(footer: string) {
    super();

    this.footer = footer;
  }

  /**
   * Writes the `footer` to the tablature.
   * @param tab - The tablature to write the footer.
   * @returns The result of the writing operation.
   */
  protected internalWriteOnTab(tab: Tab): InstructionWriteResult {
    tab.writeFooter(this.footer);

    return new SuccessInstructionWriteResult();
  }
}
