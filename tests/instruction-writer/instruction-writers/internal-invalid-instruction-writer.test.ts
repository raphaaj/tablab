import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { InternalInvalidInstructionWriter } from '../../../src/instruction-writer/instruction-writers/internal-invalid-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { Tab } from '../../../src/tab/tab';

describe(`[${InternalInvalidInstructionWriter.name}]`, () => {
  it('should not be a mergeable instruction writer', () => {
    const reasonIdentifier = InvalidInstructionReason.UnknownReason;
    const instructionWriter = new InternalInvalidInstructionWriter({ reasonIdentifier });

    expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
  });

  describe('[writeOnTab]', () => {
    it.each(Object.values(InvalidInstructionReason) as InvalidInstructionReason[])(
      'should return a failed write result for the reason identifier %s',
      (reasonIdentifier) => {
        const instructionWriter = new InternalInvalidInstructionWriter({ reasonIdentifier });
        const tab = new Tab();

        const writeResult = instructionWriter.writeOnTab(tab);

        expect(writeResult.failureMessage).toBeDefined();
        expect(writeResult.failureReasonIdentifier).toBe(reasonIdentifier);
        expect(writeResult.instructionWriter).toBe(instructionWriter);
        expect(writeResult.success).toBe(false);
        expect(writeResult.tab).toBe(tab);
      }
    );
  });
});
