import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { HeaderInstructionWriter } from '../../../src/instruction-writer/instruction-writers/header-instruction-writer';
import { MergeableInstructionWriter } from '../../../src/instruction-writer/instruction-writers/mergeable-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { Tab } from '../../../src/tab/tab';

function getTestParsedInstruction(header: string): ParsedInstructionData {
  const alias = 'header';
  const instruction = `${alias} ( ${header} )`;

  return {
    method: {
      alias,
      identifier: MethodInstruction.Header,
      args: [header],
      targets: [],
    },
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

describe(`[${HeaderInstructionWriter.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a header instruction writer as expected', () => {
      const header = 'test header';
      const parsedInstruction = getTestParsedInstruction(header);

      const instructionWriter = new HeaderInstructionWriter({ parsedInstruction, header });

      expect(instructionWriter.parsedInstruction).toBe(parsedInstruction);
      expect(instructionWriter.header).toBe(header);
    });

    it('should not be a mergeable instruction writer', () => {
      const header = 'test header';
      const parsedInstruction = getTestParsedInstruction(header);

      const instructionWriter = new HeaderInstructionWriter({ parsedInstruction, header });

      expect(instructionWriter).not.toBeInstanceOf(MergeableInstructionWriter);
    });
  });

  describe('[writeOnTab]', () => {
    it('should write the header to the tab on write, returning a success write result', () => {
      const header = 'test header';
      const parsedInstruction = getTestParsedInstruction(header);

      const instructionWriter = new HeaderInstructionWriter({ parsedInstruction, header });
      const tab = new Tab();

      tab.writeHeader = jest.fn();
      const writeResult = instructionWriter.writeOnTab(tab);

      expect(tab.writeHeader).toHaveBeenCalledWith(header);
      expect(writeResult.childResults).toBe(null);
      expect(writeResult.failureMessage).toBe(null);
      expect(writeResult.failureReasonIdentifier).toBe(null);
      expect(writeResult.instructionWriter).toBe(instructionWriter);
      expect(writeResult.success).toBe(true);
      expect(writeResult.tab).toBe(tab);
    });
  });
});
