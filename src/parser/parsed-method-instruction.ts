import { Enclosure, EnclosuresHelper } from '../helpers/enclosures-helper';
import { ParsedInstructionData } from './parsed-instruction';

export type MethodTargetExtractionResult = {
  readFromIndex: number;
  target: string;
};

/**
 * The method data of a parsed method instruction.
 */
export interface ParsedMethodInstructionData {
  /**
   * The alias used to reference the method instruction.
   */
  alias: string;

  /**
   * The arguments of the method instruction. If the method instruction has no
   * arguments, it will be an empty array.
   */
  args: string[];

  /**
   * The method instruction identifier.
   */
  identifier: string | null;

  /**
   * The data of the instructions over which the method instruction should be
   * applied. If the method instruction has no targets, it will be an empty
   * array.
   */
  targets: ParsedInstructionData[];
}

/**
 * The options to create a parsed method instruction.
 */
export type ParsedMethodInstructionOptions = {
  alias: string;
  args: string[];
  identifier?: string | null;
  targets: ParsedInstructionData[];
};

export class ParsedMethodInstruction implements ParsedMethodInstructionData {
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

    let methodArguments = EnclosuresHelper.getValueInsideEnclosure(
      instruction,
      indexOfArgumentsOpeningEnclosure
    )
      .split(argumentsSeparator)
      .map((argument) => argument.trim());

    if (methodArguments.length === 1 && methodArguments[0] === '') methodArguments = [];

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
  targets: ParsedInstructionData[];

  constructor({ alias, args, identifier, targets }: ParsedMethodInstructionOptions) {
    this.alias = alias;
    this.args = args;
    this.identifier = identifier || null;
    this.targets = targets;
  }
}
