import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { SetSpacingInstructionWriter } from '../../../src/instruction-writer/instruction-writers/set-spacing-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(spacing: number): ParsedInstructionData {
  const alias = 'spacing';
  const instruction = `${alias} ( ${spacing} )`;

  return {
    method: {
      alias,
      identifier: MethodInstruction.SetSpacing,
      args: [spacing.toString()],
      targets: [],
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${SetSpacingInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a set spacing instruction writer as expected', () => {
      const spacing = 1;
      const parsedInstruction = getTestParsedInstruction(spacing);

      const instructionWriter = new SetSpacingInstructionWriter({ parsedInstruction, spacing });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.spacing).toBe(spacing);
    });

    it('should not be a mergeable instruction writer', () => {
      const spacing = 1;
      const parsedInstruction = getTestParsedInstruction(spacing);

      const instructionWriter = new SetSpacingInstructionWriter({ parsedInstruction, spacing });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should set the tab rows spacing on write, returning a success write result', () => {
      const spacing = 10;
      const parsedInstruction = getTestParsedInstruction(spacing);

      const instructionWriter = new SetSpacingInstructionWriter({ parsedInstruction, spacing });
      const tab = new Tab();

      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.spacing).toBe(spacing);
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
