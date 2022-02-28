import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';
import { MethodInstructionIdentifier } from '../../../src/instruction/enums/method-instruction-identifier';
import { InternalInvalidInstructionDescriptionTemplateProvider } from '../../../src/instruction/providers/internal-invalid-instruction-description-template-provider';
import { Tab } from '../../../src/tab/tab';

describe('[InternalInvalidInstructionDescriptionTemplateProvider]', () => {
  it('should have a description template for each invalid instruction reason', () => {
    let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
    for (invalidInstructionReasonKey in InvalidInstructionReason) {
      const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

      const descriptionTemplate =
        InternalInvalidInstructionDescriptionTemplateProvider[invalidInstructionReason];

      expect(descriptionTemplate).toBeDefined();
    }
  });

  it('should have description function templates that returns strings when no data is provided', () => {
    let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
    for (invalidInstructionReasonKey in InvalidInstructionReason) {
      const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

      const descriptionTemplate =
        InternalInvalidInstructionDescriptionTemplateProvider[invalidInstructionReason];

      if (typeof descriptionTemplate !== 'function') continue;

      const description = descriptionTemplate();
      const descriptionType = typeof description;

      expect(description).toBeDefined();
      expect(descriptionType).toBe('string');
    }
  });

  it('should have description function templates that returns strings when a tab instance is provided', () => {
    let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
    for (invalidInstructionReasonKey in InvalidInstructionReason) {
      const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

      const descriptionTemplate =
        InternalInvalidInstructionDescriptionTemplateProvider[invalidInstructionReason];

      if (typeof descriptionTemplate !== 'function') continue;

      const description = descriptionTemplate({ tab: new Tab() });
      const descriptionType = typeof description;

      expect(description).toBeDefined();
      expect(descriptionType).toBe('string');
    }
  });

  it('should have description function templates that returns strings when a method instruction data is provided', () => {
    let invalidInstructionReasonKey: keyof typeof InvalidInstructionReason;
    for (invalidInstructionReasonKey in InvalidInstructionReason) {
      const invalidInstructionReason = InvalidInstructionReason[invalidInstructionReasonKey];

      const descriptionTemplate =
        InternalInvalidInstructionDescriptionTemplateProvider[invalidInstructionReason];

      if (typeof descriptionTemplate !== 'function') continue;

      const description = descriptionTemplate({
        methodInstructionData: {
          alias: 'b',
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Break,
        },
      });
      const descriptionType = typeof description;

      expect(description).toBeDefined();
      expect(descriptionType).toBe('string');
    }
  });
});
