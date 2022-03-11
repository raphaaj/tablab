import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import {
  FailedWriteResultDescriptionTemplate,
  FailedWriteResultDescriptionTemplateFunctionData,
  FailedWriteResultDescriptionTemplateProvider,
} from '../providers/failed-write-result-description-template-provider';
import { internalFailedWriteResultDescriptionTemplateProvider } from '../providers/internal-failed-write-result-description-template-provider';

/**
 * The options to create an internal failed write result description factory.
 */
export type InternalFailedWriteResultDescriptionFactoryOptions = {
  /**
   * The description template provider to be used to generate the descriptions
   * for failed write results.
   * @defaultValue {@link InternalFailedWriteResultDescriptionFactory.DEFAULT_DESCRIPTION_TEMPLATE_PROVIDER}
   */
  descriptionTemplateProvider?: FailedWriteResultDescriptionTemplateProvider;
};

/**
 * The internal failed write result description factory. It uses a description
 * template provider to generate descriptions for failed write results.
 *
 * @see {@link getDescription}
 */
export class InternalFailedWriteResultDescriptionFactory {
  static readonly DEFAULT_DESCRIPTION_TEMPLATE_PROVIDER: FailedWriteResultDescriptionTemplateProvider =
    internalFailedWriteResultDescriptionTemplateProvider;

  /**
   * The description template provider used to generate the descriptions for
   * failed write results.
   */
  readonly descriptionTemplateProvider: FailedWriteResultDescriptionTemplateProvider;

  /**
   * Creates an internal write result description factory instance.
   * @param options - The options to create an internal write result description
   * factory instance.
   */
  constructor({
    descriptionTemplateProvider,
  }: InternalFailedWriteResultDescriptionFactoryOptions = {}) {
    if (descriptionTemplateProvider) this.descriptionTemplateProvider = descriptionTemplateProvider;
    else
      this.descriptionTemplateProvider =
        InternalFailedWriteResultDescriptionFactory.DEFAULT_DESCRIPTION_TEMPLATE_PROVIDER;
  }

  /**
   * Creates a description for a failed write result.
   * @param failureReasonIdentifier - The token that identifies the reason for
   * the write operation to have failed.
   * @param templateRenderizationData - The data used to render the description
   * template.
   * @returns The description.
   */
  getDescription(
    failureReasonIdentifier: InvalidInstructionReason,
    templateRenderizationData?: FailedWriteResultDescriptionTemplateFunctionData
  ): string {
    const descriptionTemplate = this._getDescriptionTemplate(failureReasonIdentifier);

    let description: string;
    if (typeof descriptionTemplate === 'string') {
      description = descriptionTemplate;
    } else {
      description = descriptionTemplate(templateRenderizationData);
    }

    return description;
  }

  private _getDescriptionTemplate(
    invalidInstructionReason: InvalidInstructionReason
  ): FailedWriteResultDescriptionTemplate {
    const descriptionTemplate = this.descriptionTemplateProvider[invalidInstructionReason];

    if (!descriptionTemplate)
      throw new Error(`No description template identified for reason ${invalidInstructionReason}`);

    return descriptionTemplate;
  }
}
