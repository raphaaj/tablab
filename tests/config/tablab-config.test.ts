import { InvalidInstructionReason } from '../../src/instruction/enums/invalid-instruction-reason';

async function importModules() {
  jest.resetModules();
  const { TablabConfig } = await import('../../src/config/tablab-config');
  const { InternalInvalidInstructionDescriptionTemplateProvider } = await import(
    '../../src/instruction/providers/internal-invalid-instruction-description-template-provider'
  );

  return {
    TablabConfig,
    InternalInvalidInstructionDescriptionTemplateProvider,
  };
}

describe(`[TablabConfig]`, () => {
  describe('invalid instruction description template provider', () => {
    it('should use the internal provider by default', async () => {
      const { TablabConfig, InternalInvalidInstructionDescriptionTemplateProvider } =
        await importModules();

      const invalidInstructionDescriptionTemplateProvider =
        TablabConfig.getInvalidInstructionDescriptionTemplateProvider();

      expect(invalidInstructionDescriptionTemplateProvider).toEqual(
        InternalInvalidInstructionDescriptionTemplateProvider
      );
    });

    it('should allow the use of a custom provider', async () => {
      const { TablabConfig, InternalInvalidInstructionDescriptionTemplateProvider } =
        await importModules();

      const customProvider = Object.assign(
        {},
        InternalInvalidInstructionDescriptionTemplateProvider
      );
      for (const key in customProvider) {
        customProvider[key as InvalidInstructionReason] = 'custom description template';
      }

      TablabConfig.useInvalidInstructionDescriptionTemplateProvider(customProvider);

      const invalidInstructionDescriptionTemplateProvider =
        TablabConfig.getInvalidInstructionDescriptionTemplateProvider();

      expect(invalidInstructionDescriptionTemplateProvider).toBe(customProvider);
    });
  });
});
