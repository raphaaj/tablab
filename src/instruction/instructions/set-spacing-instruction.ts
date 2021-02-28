import { Tab } from '../../tab/tab';
import { Instruction } from './instruction';

export class SetSpacingInstruction extends Instruction {
  spacing: number;

  constructor(spacing: number) {
    super();

    this.spacing = spacing;
  }

  writeOnTab(tab: Tab): void {
    tab.spacing = this.spacing;
  }
}
