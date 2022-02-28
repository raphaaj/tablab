import { InvalidInstructionReason } from '../instruction/enums/invalid-instruction-reason';
import { InternalInvalidInstructionDescriptionTemplateProvider } from '../instruction/providers/internal-invalid-instruction-description-template-provider';
import { InvalidInstructionDescriptionTemplateProvider } from '../instruction/providers/invalid-instruction-description-template-provider';

export class TablabConfig {
  private static _invalidInstructionDescriptionTemplateProvider: InvalidInstructionDescriptionTemplateProvider<InvalidInstructionReason> =
    InternalInvalidInstructionDescriptionTemplateProvider;

  static getInvalidInstructionDescriptionTemplateProvider(): InvalidInstructionDescriptionTemplateProvider<InvalidInstructionReason> {
    return TablabConfig._invalidInstructionDescriptionTemplateProvider;
  }

  static useInvalidInstructionDescriptionTemplateProvider(
    invalidInstructionDescriptionTemplateProvider: InvalidInstructionDescriptionTemplateProvider<InvalidInstructionReason>
  ): void {
    TablabConfig._invalidInstructionDescriptionTemplateProvider =
      invalidInstructionDescriptionTemplateProvider;
  }
}
