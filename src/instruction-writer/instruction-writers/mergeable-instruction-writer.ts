import { Note } from '../../tab/note';
import { BaseInstructionWriter, BaseInstructionWriterOptions } from './base-instruction-writer';

/**
 * The options to create a mergeable instruction writer.
 */
export type MergeableInstructionWriterOptions = BaseInstructionWriterOptions & {
  note: Note;
};

/**
 * The base class for all mergeable instruction writers.
 */
export abstract class MergeableInstructionWriter extends BaseInstructionWriter {
  readonly note: Note;

  constructor(options: MergeableInstructionWriterOptions) {
    super(options);

    this.note = options.note;
  }
}
