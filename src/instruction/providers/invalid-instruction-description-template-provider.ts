import { Tab } from '../../tab/tab';
import { MethodInstructionData } from '../factories/instruction-factory-base';

export type InvalidInstructionDescriptionFunctionTemplateParams = {
  methodInstructionData?: MethodInstructionData;
  tab?: Tab;
};

export type InvalidInstructionDescriptionTemplate =
  | string
  | ((params?: InvalidInstructionDescriptionFunctionTemplateParams) => string);

export type InvalidInstructionDescriptionTemplateProvider<T extends string | number | symbol> =
  Record<T, InvalidInstructionDescriptionTemplate>;
