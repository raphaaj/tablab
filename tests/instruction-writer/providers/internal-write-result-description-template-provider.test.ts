import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { FailedWriteResultDescriptionTemplateFunctionData } from '../../../src/instruction-writer/providers/failed-write-result-description-template-provider';
import { internalFailedWriteResultDescriptionTemplateProvider } from '../../../src/instruction-writer/providers/internal-failed-write-result-description-template-provider';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';
import { ParsedMethodInstructionData } from '../../../src/parser/parsed-method-instruction';
import { Tab } from '../../../src/tab/tab';

function getParsedInstructionForBasicInstruction(): ParsedInstructionData {
  const instruction = '1-0';

  return {
    method: null,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

function getParsedInstructionForMethodInstruction(): ParsedInstructionData {
  const alias = 'testAlias';
  const identifier = 'testIdentifier';

  const instruction = alias;

  const method: ParsedMethodInstructionData = {
    alias,
    identifier,
    args: [],
    targets: [],
  };

  return {
    method,
    readFromIndex: 0,
    readToIndex: instruction.length,
    value: instruction,
  };
}

type DescriptionFunctionTemplateTestCase = {
  context: string;
  descriptionTemplateArgs?: FailedWriteResultDescriptionTemplateFunctionData;
};

describe('[InternalFailedWriteResultDescriptionTemplateProvider]', () => {
  it('should have a description template for each invalid instruction reason', () => {
    let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
    for (invalidInstructionReasonKey in InvalidInstructionReason) {
      const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

      const descriptionTemplate =
        internalFailedWriteResultDescriptionTemplateProvider[invalidInstructionReason];

      expect(descriptionTemplate).toBeDefined();
      expect(['string', 'function'].includes(typeof descriptionTemplate)).toBe(true);
    }
  });

  const descriptionFunctionTemplatesTestCases: DescriptionFunctionTemplateTestCase[] = [
    { context: 'no data is provided', descriptionTemplateArgs: undefined },
    { context: 'a tab instance is provided', descriptionTemplateArgs: { tab: new Tab() } },
    {
      context: 'a parsed basic instruction data is provided',
      descriptionTemplateArgs: { parsedInstruction: getParsedInstructionForBasicInstruction() },
    },
    {
      context: 'a parsed method instruction data is provided',
      descriptionTemplateArgs: { parsedInstruction: getParsedInstructionForMethodInstruction() },
    },
  ];
  it.each(descriptionFunctionTemplatesTestCases)(
    `should have description function templates that returns strings when $context`,
    ({ descriptionTemplateArgs }) => {
      let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
      for (invalidInstructionReasonKey in InvalidInstructionReason) {
        const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

        const descriptionTemplate =
          internalFailedWriteResultDescriptionTemplateProvider[invalidInstructionReason];

        if (typeof descriptionTemplate !== 'function') continue;

        const description = descriptionTemplate(descriptionTemplateArgs);

        expect(description).toBeDefined();
        expect(typeof description).toBe('string');
      }
    }
  );
});
