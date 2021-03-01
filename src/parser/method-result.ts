import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { StringHelper } from '../helpers/string-helper';
import { ParserResult } from './parser-result';

export type MethodArgument = string | number;

export type TargetExtractionResult = {
  indexAtInstruction: number;
  target: string;
};

export interface MethodResultData {
  alias: string;
  args: MethodArgument[];
  targets: ParserResult[];
}

export class MethodResult {
  static extractMethodAlias(instruction: string): string | null {
    const extractionRegexp = /^([a-z]+)(?!-)/i;
    const extractionResult = extractionRegexp.exec(instruction);

    let methodAlias = null;
    if (extractionResult) {
      methodAlias = extractionResult[1];
    }

    return methodAlias;
  }

  static extractMethodArguments(
    instruction: string,
    argumentsOpeningEnclosure: string,
    argumentsSeparator: string
  ): MethodArgument[] {
    const indexOfArgumentsOpeningEnclosure = instruction.indexOf(argumentsOpeningEnclosure);
    if (indexOfArgumentsOpeningEnclosure < 0) return [];

    const methodArguments = EnclosuresHelper.getValueInsideEnclosure(
      instruction,
      indexOfArgumentsOpeningEnclosure
    )
      .split(argumentsSeparator)
      .filter((argument) => argument && argument.trim())
      .map((argument) => StringHelper.tryConvertToNumber(argument.trim()));

    return methodArguments;
  }

  static extractMethodTarget(
    instruction: string,
    targetsOpeningEnclosure: string
  ): TargetExtractionResult | null {
    const indexOfTargetsOpeningEnclosure = instruction.indexOf(targetsOpeningEnclosure);
    if (indexOfTargetsOpeningEnclosure < 0) return null;

    const methodTarget = EnclosuresHelper.getValueInsideEnclosure(
      instruction,
      indexOfTargetsOpeningEnclosure
    );

    return { target: methodTarget, indexAtInstruction: instruction.indexOf(methodTarget) };
  }

  alias: string;
  args: MethodArgument[];
  targets: ParserResult[];

  constructor({ alias, args, targets }: MethodResultData) {
    this.alias = alias;
    this.args = args;
    this.targets = targets;
  }
}
