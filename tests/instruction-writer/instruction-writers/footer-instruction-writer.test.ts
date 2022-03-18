import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { FooterInstructionWriter } from '../../../src/instruction-writer/instruction-writers/footer-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(footer: string): ParsedInstructionData {
  const alias = 'footer';
  const instruction = `${alias} ( ${footer} )`;

  return {
    method: {
      alias,
      identifier: MethodInstruction.Footer,
      args: [footer],
      targets: [],
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${FooterInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a footer instruction writer as expected', () => {
      const footer = 'test footer';
      const parsedInstruction = getTestParsedInstruction(footer);

      const instructionWriter = new FooterInstructionWriter({ parsedInstruction, footer });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.footer).toBe(footer);
    });

    it('should not be a mergeable instruction writer', () => {
      const footer = 'test footer';
      const parsedInstruction = getTestParsedInstruction(footer);

      const instructionWriter = new FooterInstructionWriter({ parsedInstruction, footer });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should write the footer to the tab on write, returning a success write result', () => {
      const footer = 'test footer';
      const parsedInstruction = getTestParsedInstruction(footer);

      const instructionWriter = new FooterInstructionWriter({ parsedInstruction, footer });
      const tab = new Tab();

      tab.writeFooter = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeFooter).toHaveBeenCalledWith(footer);
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
