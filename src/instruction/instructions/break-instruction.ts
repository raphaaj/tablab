import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';

export class BreakInstruction extends Instruction {
  writeOnTab(tab: Tab): void {
    tab.addBlock();
  }
}
