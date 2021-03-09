import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { ParserResult } from './parser-result';
import { InstructionMethodData } from '../instruction/core/instruction-factory-base';

export type TargetExtractionResult = {
  indexAtInstruction: number;
  target: string;
};

export type MethodResultData = {
  alias: string;
  args: string[];
  identifier: string | null;
  targets: ParserResult[];
};

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
  args: string[];
  identifier: string | null;
  targets: ParserResult[];

  constructor({ alias, args, identifier, targets }: MethodResultData) {
    this.alias = alias;
    this.args = args;
    this.identifier = identifier || null;
    this.targets = targets;
  }

  asInstructionMethodData(): InstructionMethodData {
    return {
      args: this.args,
      identifier: this.identifier,
      targets: this.targets.map((target) => target.asInstructionData()),
    };
  }
}
