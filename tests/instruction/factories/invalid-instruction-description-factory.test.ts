import { InvalidInstructionDescriptionTemplateProvider } from '../../../src';
import { TablabConfig } from '../../../src/config/tablab-config';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';
import { InvalidInstructionDescriptionFactory } from '../../../src/instruction/factories/invalid-instruction-description-factory';
import { InternalInvalidInstructionDescriptionTemplateProvider } from '../../../src/instruction/providers/internal-invalid-instruction-description-template-provider';

function getEmptyDescriptionTemplateProvider(): InvalidInstructionDescriptionTemplateProvider<InvalidInstructionReason> {
  const emptyDescriptionTemplateProvider = Object.assign(
    {},
    InternalInvalidInstructionDescriptionTemplateProvider
  );

  for (const key in emptyDescriptionTemplateProvider) {
    emptyDescriptionTemplateProvider[key as InvalidInstructionReason] = '';
  }

  return emptyDescriptionTemplateProvider;
}

const tablabConfigDescriptionTemplateProviderSpy = jest.spyOn(
  TablabConfig,
  'getInvalidInstructionDescriptionTemplateProvider'
);

afterEach(() => tablabConfigDescriptionTemplateProviderSpy.mockReset());

describe(`[${InvalidInstructionDescriptionFactory}]`, () => {
  it('should get a description from a string template', () => {
    const invalidInstructionReason = InvalidInstructionReason.UnknownReason;
    const expectedDescription = 'description string template';

    const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();
    descriptionTemplateProvider[invalidInstructionReason] = expectedDescription;

    tablabConfigDescriptionTemplateProviderSpy.mockReturnValue(descriptionTemplateProvider);

    const description = InvalidInstructionDescriptionFactory.getDescription({
      invalidInstructionReason,
    });

    expect(description).toBe(expectedDescription);
  });

  it('should get a description from a function template', () => {
    const invalidInstructionReason = InvalidInstructionReason.UnknownReason;
    const expectedDescription = 'description string template';

    const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();
    descriptionTemplateProvider[invalidInstructionReason] = () => expectedDescription;

    tablabConfigDescriptionTemplateProviderSpy.mockReturnValue(descriptionTemplateProvider);

    const description = InvalidInstructionDescriptionFactory.getDescription({
      invalidInstructionReason,
    });

    expect(description).toBe(expectedDescription);
  });

  it('should throw if no description template is identified for the given reason', () => {
    const invalidInstructionReason = InvalidInstructionReason.UnknownReason;

    const descriptionTemplateProvider = getEmptyDescriptionTemplateProvider();

    // @ts-expect-error > force the scenario where no description template is identified for the tested reason
    descriptionTemplateProvider[invalidInstructionReason] = undefined;

    tablabConfigDescriptionTemplateProviderSpy.mockReturnValue(descriptionTemplateProvider);

    expect(() =>
      InvalidInstructionDescriptionFactory.getDescription({
        invalidInstructionReason,
      })
    ).toThrow();
  });
});
