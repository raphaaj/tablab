import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { BreakInstructionWriter } from '../../../src/instruction-writer/instruction-writers/break-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(): ParsedInstructionData {
  const alias = 'break';
  const instruction = alias;

  return {
    method: {
      alias,
      identifier: MethodInstruction.Break,
      args: [],
      targets: [],
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${BreakInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a break instruction writer as expected', () => {
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new BreakInstructionWriter({ parsedInstruction });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
    });

    it('should not be a mergeable instruction writer', () => {
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new BreakInstructionWriter({ parsedInstruction });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should add a tab block to the tab on write, returning a success write result', () => {
      const parsedInstruction = getTestParsedInstruction();

      const instructionWriter = new BreakInstructionWriter({ parsedInstruction });
      const tab = new Tab();

      tab.addBlock = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.addBlock).toHaveBeenCalled();
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
