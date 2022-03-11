import { ParsedInstructionData } from '../../parser/parsed-instruction';
import { Tab } from '../../tab/tab';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';

export type FailedWriteResultDescriptionTemplateFunctionData = {
  parsedInstruction?: ParsedInstructionData | null;
  tab?: Tab | null;
};

export type FailedWriteResultDescriptionTemplateFunction = (
  params?: FailedWriteResultDescriptionTemplateFunctionData
) => string;

export type FailedWriteResultDescriptionTemplate =
  | string
  | FailedWriteResultDescriptionTemplateFunction;

export type FailedWriteResultDescriptionTemplateProvider = Record<
  InvalidInstructionReason,
  FailedWriteResultDescriptionTemplate
>;
