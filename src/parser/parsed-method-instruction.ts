import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { ParsedInstructionData } from './parsed-instruction';
import { MethodInstructionData } from '../instruction/core/instruction-factory-base';

export type MethodTargetExtractionResult = {
  readFromIndex: number;
  target: string;
};

export interface ParsedMethodInstructionData {
  alias: string;
  args: string[];
  identifier?: string | null;
  targets: ParsedInstructionData[];
}

export class ParsedMethodInstruction implements ParsedMethodInstructionData, MethodInstructionData {
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
  ): string[] {
    const indexOfArgumentsOpeningEnclosure = instruction.indexOf(argumentsOpeningEnclosure);
    if (indexOfArgumentsOpeningEnclosure < 0) return [];

    const methodArguments = EnclosuresHelper.getValueInsideEnclosure(
      instruction,
      indexOfArgumentsOpeningEnclosure
    )
      .split(argumentsSeparator)
      .map((argument) => argument.trim());

    return methodArguments;
  }

  static extractMethodTarget(
    instruction: string,
    targetsOpeningEnclosure: string
  ): MethodTargetExtractionResult | null {
    const indexOfTargetsOpeningEnclosure = instruction.indexOf(targetsOpeningEnclosure);
    if (indexOfTargetsOpeningEnclosure < 0) return null;

    const methodTarget = EnclosuresHelper.getValueInsideEnclosure(
      instruction,
      indexOfTargetsOpeningEnclosure
    );

    return { target: methodTarget, readFromIndex: instruction.indexOf(methodTarget) };
  }

  alias: string;
  args: string[];
  identifier: string | null;
  targets: ParsedInstructionData[];

  constructor({ alias, args, identifier, targets }: ParsedMethodInstructionData) {
    this.alias = alias;
    this.args = args;
    this.identifier = identifier || null;
    this.targets = targets;
  }
}
