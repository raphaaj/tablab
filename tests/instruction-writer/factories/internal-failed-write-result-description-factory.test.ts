import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { InternalFailedWriteResultDescriptionFactory } from '../../../src/instruction-writer/factories/internal-failed-write-result-description-factory';
import {
  FailedWriteResultDescriptionTemplate,
  FailedWriteResultDescriptionTemplateProvider,
} from '../../../src/instruction-writer/providers/failed-write-result-description-template-provider';
import { internalFailedWriteResultDescriptionTemplateProvider } from '../../../src/instruction-writer/providers/internal-failed-write-result-description-template-provider';

function getEmptyDescriptionTemplateProvider(): FailedWriteResultDescriptionTemplateProvider {
  const emptyDescriptionTemplateProvider: Record<
    InvalidInstructionReason,
    FailedWriteResultDescriptionTemplate
  > = Object.assign({}, internalFailedWriteResultDescriptionTemplateProvider);

  let invalidInstructionReasonKey: keyof typeof emptyDescriptionTemplateProvider;
  for (invalidInstructionReasonKey in emptyDescriptionTemplateProvider) {
    emptyDescriptionTemplateProvider[invalidInstructionReasonKey] = '';
  }

  return emptyDescriptionTemplateProvider;
}

describe(`[${InternalFailedWriteResultDescriptionFactory}]`, () => {
  describe('[constructor]', () => {
    it('should use the default description template provider if one is not specified', () => {
      const factory = new InternalFailedWriteResultDescriptionFactory();

      expect(factory.descriptionTemplateProvider).toBe(
        InternalFailedWriteResultDescriptionFactory.DEFAULT_DESCRIPTION_TEMPLATE_PROVIDER
      );
    });

    it('should use the given description template provider when specified', () => {
      const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();

      const factory = new InternalFailedWriteResultDescriptionFactory({
        descriptionTemplateProvider,
      });

      expect(factory.descriptionTemplateProvider).toBe(descriptionTemplateProvider);
      expect(factory.descriptionTemplateProvider).not.toBe(
        InternalFailedWriteResultDescriptionFactory.DEFAULT_DESCRIPTION_TEMPLATE_PROVIDER
      );
    });
  });

  describe('[getDescription]', () => {
    it('should get a description from a string template', () => {
      const invalidInstructionReason = InvalidInstructionReason.UnknownReason;
      const expectedDescription = 'description string template';
      const descriptionTemplate = expectedDescription;

      const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();
      descriptionTemplateProvider[invalidInstructionReason] = descriptionTemplate;

      const factory = new InternalFailedWriteResultDescriptionFactory({
        descriptionTemplateProvider,
      });

      const description = factory.getDescription(invalidInstructionReason);

      expect(description).toBe(expectedDescription);
    });

    it('should get a description from a function template', () => {
      const invalidInstructionReason = InvalidInstructionReason.UnknownReason;
      const expectedDescription = 'description string template';
      const descriptionTemplate = jest.fn(() => expectedDescription);

      const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();
      descriptionTemplateProvider[invalidInstructionReason] = descriptionTemplate;

      const factory = new InternalFailedWriteResultDescriptionFactory({
        descriptionTemplateProvider,
      });

      const description = factory.getDescription(invalidInstructionReason);

      expect(description).toBe(expectedDescription);
      expect(descriptionTemplate).toHaveBeenCalled();
    });

    it('should throw if no description template is identified for the given reason', () => {
      const invalidInstructionReason = InvalidInstructionReason.UnknownReason;

      const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();

      // @ts-expect-error > force the scenario where no description template is identified for the tested reason
      descriptionTemplateProvider[invalidInstructionReason] = undefined;

      const factory = new InternalFailedWriteResultDescriptionFactory({
        descriptionTemplateProvider,
      });

      expect(() => factory.getDescription(invalidInstructionReason)).toThrow();
    });
  });
});
