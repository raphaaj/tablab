import { Tab } from '../../tab/tab';

export abstract class Instruction {
  public abstract writeOnTab(tab: Tab): void;
}
