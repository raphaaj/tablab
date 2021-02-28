import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';

export class WriteHeaderInstruction extends Instruction {
  header: string;

  constructor(header: string) {
    super();

    this.header = header;
  }

  writeOnTab(tab: Tab): void {
    tab.writeHeader(this.header);
  }
}
