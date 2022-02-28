import { TablabConfig } from '../../config/tablab-config';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InvalidInstructionDescriptionFunctionTemplateParams } from '../providers/invalid-instruction-description-template-provider';

export type GetInvalidInstructionDescriptionData =
  InvalidInstructionDescriptionFunctionTemplateParams & {
    invalidInstructionReason: InvalidInstructionReason;
  };

export class InvalidInstructionDescriptionFactory {
  static getDescription({
    invalidInstructionReason,
    ...extractionData
  }: GetInvalidInstructionDescriptionData): string {
    const descriptionTemplate =
      InvalidInstructionDescriptionFactory._getDescriptionTemplate(invalidInstructionReason);

    let description: string;
    if (typeof descriptionTemplate === 'string') {
      description = descriptionTemplate;
    } else {
      description = descriptionTemplate(extractionData);
    }

    return description;
  }

  private static _getDescriptionTemplate(invalidInstructionReason: InvalidInstructionReason) {
    const descriptionsProvider = TablabConfig.getInvalidInstructionDescriptionTemplateProvider();
    const descriptionTemplate = descriptionsProvider[invalidInstructionReason];

    if (!descriptionTemplate)
      throw new Error(`No description template identified for reason ${invalidInstructionReason}`);

    return descriptionTemplate;
  }
}
