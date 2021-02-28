import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';

export class WriteFooterInstruction extends Instruction {
  footer: string;

  constructor(footer: string) {
    super();

    this.footer = footer;
  }

  writeOnTab(tab: Tab): void {
    tab.writeFooter(this.footer);
  }
}
