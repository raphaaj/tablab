import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { InternalInvalidInstructionWriter } from '../../../src/instruction-writer/instruction-writers/internal-invalid-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(): ParsedInstructionData {
  const instruction = '0-0';

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${InternalInvalidInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create an internal invalid instruction writer as expected', () => {
      const parsedInstruction = getTestParsedInstruction();
      const reasonIdentifier = InvalidInstructionReason.UnknownReason;

      const instructionWriter = new InternalInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier,
      });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.reasonIdentifier).toBe(reasonIdentifier);
      expect(instructionWriter.description).toBeDefined();
    });

    it('should not be a mergeable instruction writer', () => {
      const parsedInstruction = getTestParsedInstruction();
      const reasonIdentifier = InvalidInstructionReason.UnknownReason;

      const instructionWriter = new InternalInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier,
      });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it.each(Object.values(InvalidInstructionReason) as InvalidInstructionReason[])(
      'should return a failed write result for the reason identifier %s',
      (reasonIdentifier) => {
        const parsedInstruction = getTestParsedInstruction();

        const instructionWriter = new InternalInvalidInstructionWriter({
          parsedInstruction,
          reasonIdentifier,
        });
        const tab = new Tab();

        const writeResult = instructionWriter.writeOnTab(tab);

        expect(writeResult.childResults).toBe(null);
        expect(writeResult.failureMessage).toBeDefined();
        expect(writeResult.failureReasonIdentifier).toBe(reasonIdentifier);
        expect(writeResult.instructionWriter).toBe(instructionWriter);
        expect(writeResult.success).toBe(false);
        expect(writeResult.tab).toBe(tab);
      }
    );
  });
});
