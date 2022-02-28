import { Enclosure, EnclosuresHelper } from '../helpers/enclosures-helper';
import { MethodInstructionData } from '../instruction/factories/instruction-factory-base';
import { ParsedInstruction } from './parsed-instruction-result';

export type MethodTargetExtractionResult = {
  readFromIndex: number;
  target: string;
};

/**
 * The method data of an extracted method instruction.
 */
export interface ParsedMethodInstruction {
  /**
   * The alias used to reference the method.
   */
  alias: string;

  /**
   * The arguments of the method instruction. If the method instruction has no
   * arguments, it will be an empty array.
   */
  args: string[];

  /**
   * The method identifier.
   */
  identifier?: string | null;

  /**
   * The data of the instructions over which the method instruction should be
   * applied. If the method instruction has no targets, it will be an empty
   * array.
   */
  targets: ParsedInstruction[];
}

export class ParsedMethodInstructionResult
  implements ParsedMethodInstruction, MethodInstructionData
{
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
    argumentsEnclosure: Enclosure,
    argumentsSeparator: string
  ): string[] {
    const openingEnclosureCharacter =
      EnclosuresHelper.getOpeningEnclosureFromEnclosureType(argumentsEnclosure);

    const indexOfArgumentsOpeningEnclosure = instruction.indexOf(openingEnclosureCharacter);
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
    targetsEnclosure: Enclosure
  ): MethodTargetExtractionResult | null {
    const openingEnclosureCharacter =
      EnclosuresHelper.getOpeningEnclosureFromEnclosureType(targetsEnclosure);

    const indexOfTargetsOpeningEnclosure = instruction.indexOf(openingEnclosureCharacter);
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
  targets: ParsedInstruction[];

  constructor({ alias, args, identifier, targets }: ParsedMethodInstruction) {
    this.alias = alias;
    this.args = args;
    this.identifier = identifier || null;
    this.targets = targets;
  }
}
