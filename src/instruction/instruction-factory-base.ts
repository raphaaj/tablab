import { StringHelper } from '../helpers/string-helper';
import { Instruction } from './instructions/instruction';
import { InvalidInstruction } from './instructions/invalid-instruction';
import { WriteNoteInstruction } from './instructions/write-note-instruction';
import {
  InvalidInstructionReason,
  InvalidInstructionReasonDescription,
} from './enums/invalid-instruction-reason';
import { Note } from '../tab/note';

/**
 * The method data of a method instruction.
 */
export interface MethodInstructionData {
  /**
   * The method alias.
   */
  alias: string;

  /**
   * The method instruction arguments.
   */
  args: string[];

  /**
   * The method identifier.
   */
  identifier?: string | null;

  /**
   * The method instruction targets.
   */
  targets: InstructionData[];
}

/**
 * The data of an instruction.
 */
export interface InstructionData {
  /**
   * The method data of the instruction.
   */
  method: MethodInstructionData | null;

  /**
   * The instruction value.
   */
  value: string;
}

/**
 * An instruction instance provider.
 */
export interface InstructionProvider {
  /**
   * Creates an instruction instance from the instruction data. The created
   * instruction can be used to write the data to a tablature element.
   * @param instructionData - The instruction data.
   * @returns The instruction instance created.
   */
  getInstruction(instructionData: InstructionData): Instruction;
}

/**
 * The options to perform a validation for a minimum number of arguments
 * of a method instruction.
 */
export type ArgumentsMinNumberValidation = {
  /**
   * The invalid instruction to be returned if the number of
   * arguments verified is smaller than the minimum number specified.
   */
  invalidInstructionIfLess: InvalidInstruction;

  /**
   * The minimum number of arguments allowed.
   */
  minNumber: number;
};

/**
 * The options to perform a validation for a maximum number of arguments
 * of a method instruction.
 */
export type ArgumentsMaxNumberValidation = {
  /**
   * The invalid instruction to be returned if the number of
   * arguments verified is greater than the maximum number specified.
   */
  invalidInstructionIfMore: InvalidInstruction;

  /**
   * The maximum number of arguments allowed.
   */
  maxNumber: number;
};

/**
 * The options to perform a validation of the number of arguments
 * of a method instruction.
 */
export type ArgumentsValidation = {
  /**
   * The arguments to validate.
   */
  args: string[];

  /**
   * The options to validate for a maximum number of arguments.
   */
  maxNumberValidation?: ArgumentsMaxNumberValidation;

  /**
   * The options to validate for a minimum number of arguments.
   */
  minNumberValidation?: ArgumentsMinNumberValidation;
};

/**
 * The options to perform a validation of a method instruction single
 * argument for a minimum number value.
 */
export type ArgumentNumberMinValueValidation = {
  /**
   * The invalid instruction to be returned if the given argument
   * is a number smaller than the minimum allowed value.
   */
  invalidInstructionIfSmaller: InvalidInstruction;

  /**
   * The minimum allowed value.
   */
  minValue: number;
};

/**
 * The options to perform a validation of a method instruction single
 * argument for a maximum number value.
 */
export type ArgumentNumberMaxValueValidation = {
  /**
   * The invalid instruction to be returned if the given argument
   * is a number greater than the maximum allowed value.
   */
  invalidInstructionIfGreater: InvalidInstruction;

  /**
   * The maximum allowed value.
   */
  maxValue: number;
};

/**
 * The options to perform a validation of a method instruction single
 * argument for a number value.
 */
export type ArgumentNumberValidation = {
  /**
   * The argument value to validate for a number.
   */
  arg: string;

  /**
   * The invalid instruction to be returned if the given argument
   * is not a valid number.
   */
  invalidInstructionIfNaN: InvalidInstruction;

  /**
   * The options to validate for a maximum value.
   */
  maxValueValidation?: ArgumentNumberMaxValueValidation;

  /**
   * The options to validate for a minimum value.
   */
  minValueValidation?: ArgumentNumberMinValueValidation;
};

/**
 * The options to perform a validation for a minimum number of targets
 * of a method instruction.
 */
export type TargetsMinNumberValidation = {
  /**
   * The invalid instruction to be returned if the number of
   * targets verified is smaller than the minimum number specified.
   */
  invalidInstructionIfLess: InvalidInstruction;

  /**
   * The minimum number of targets allowed.
   */
  minNumber: number;
};

/**
 * The options to perform a validation for a maximum number of targets
 * of a method instruction.
 */
export type TargetsMaxNumberValidation = {
  /**
   * The invalid instruction to be returned if the number of
   * targets verified is greater than the maximum number specified.
   */
  invalidInstructionIfMore: InvalidInstruction;

  /**
   * The maximum number of targets allowed.
   */
  maxNumber: number;
};

/**
 * The options to perform a validation of the number of targets
 * of a method instruction.
 */
export type TargetsValidation = {
  /**
   * The options to validate for a maximum number of targets.
   */
  maxNumberValidation?: TargetsMaxNumberValidation;

  /**
   * The options to validate for a minimum number of targets.
   */
  minNumberValidation?: TargetsMinNumberValidation;

  /**
   * The targets to validate.
   */
  targets: InstructionData[];
};

export type MethodInstructionBuilder = (
  methodInstructionData: MethodInstructionData
) => Instruction;

export abstract class InstructionFactoryBase implements InstructionProvider {
  private static _extractNoteFromInstruction(instruction: string): Note | null {
    const extractionRegex = /^(\d+)-(.*)/;
    const extractionResult = extractionRegex.exec(instruction);

    if (!extractionResult) return null;

    const string = Number(extractionResult[1]);
    const fret = extractionResult[2];

    return new Note(string, fret);
  }

  /**
   * The method instruction identifiers handled by the instruction factory.
   */
  get methodInstructionIdentifiersEnabled(): string[] {
    return Object.keys(this.methodInstructionIdentifier2InstructionBuilderMap);
  }

  /**
   * The map, from a method identifier to a method instruction builder, used to
   * build instructions.
   */
  protected abstract methodInstructionIdentifier2InstructionBuilderMap: Record<
    string,
    MethodInstructionBuilder
  >;

  /**
   * Creates an instruction instance from the instruction data. The created
   * instruction can be used to write the data to a tablature element.
   * @param instructionData - The instruction data.
   * @returns The instruction instance.
   */
  getInstruction(instructionData: InstructionData): Instruction {
    if (instructionData.method) {
      return this._getInstructionFromMethodData(instructionData.method);
    } else {
      return this._getInstructionFromValue(instructionData.value);
    }
  }

  /**
   * Validates a method instruction single argument for a number value. It is
   * possible to validate for a minimum and a maximum value.
   * @param argumentValidation - The options to perform the validation.
   * @returns `null` if all validation conditions are verified, the given invalid
   * instruction instance, that corresponds to the failure reason, otherwise.
   */
  protected validateMethodArgumentForNumberValue(
    argumentValidation: ArgumentNumberValidation
  ): InvalidInstruction | null {
    if (!StringHelper.isNumber(argumentValidation.arg)) {
      return argumentValidation.invalidInstructionIfNaN;
    }

    const argumentAsNumber = Number(argumentValidation.arg);
    if (
      argumentValidation.minValueValidation !== undefined &&
      argumentAsNumber < argumentValidation.minValueValidation.minValue
    ) {
      return argumentValidation.minValueValidation.invalidInstructionIfSmaller;
    }

    if (
      argumentValidation.maxValueValidation !== undefined &&
      argumentAsNumber > argumentValidation.maxValueValidation.maxValue
    ) {
      return argumentValidation.maxValueValidation.invalidInstructionIfGreater;
    }

    return null;
  }

  /**
   * Validates the number of arguments of a method instruction. It is
   * possible to validate for a minimum and a maximum number of arguments.
   * @param argumentsValidation - The options to perform the validation.
   * @returns `null` if all validation conditions are verified, the given invalid
   * instruction instance, that corresponds to the failure reason, otherwise.
   */
  protected validateNumberOfMethodArguments(
    argumentsValidation: ArgumentsValidation
  ): InvalidInstruction | null {
    if (
      argumentsValidation.minNumberValidation !== undefined &&
      argumentsValidation.args.length < argumentsValidation.minNumberValidation.minNumber
    ) {
      return argumentsValidation.minNumberValidation.invalidInstructionIfLess;
    }

    if (
      argumentsValidation.maxNumberValidation !== undefined &&
      argumentsValidation.args.length > argumentsValidation.maxNumberValidation.maxNumber
    ) {
      return argumentsValidation.maxNumberValidation.invalidInstructionIfMore;
    }

    return null;
  }

  /**
   * Validates the number of targets of a method instruction. It is possible
   * to validate for a minimum and a maximum number of targets.
   * @param targetsValidation - The options to perform the validation.
   * @returns `null` if all validation conditions are verified, the given invalid
   * instruction instance, that corresponds to the failure reason, otherwise.
   */
  protected validateNumberOfTargets(
    targetsValidation: TargetsValidation
  ): InvalidInstruction | null {
    if (
      targetsValidation.minNumberValidation !== undefined &&
      targetsValidation.targets.length < targetsValidation.minNumberValidation.minNumber
    ) {
      return targetsValidation.minNumberValidation.invalidInstructionIfLess;
    }

    if (
      targetsValidation.maxNumberValidation !== undefined &&
      targetsValidation.targets.length > targetsValidation.maxNumberValidation.maxNumber
    ) {
      return targetsValidation.maxNumberValidation.invalidInstructionIfMore;
    }

    return null;
  }

  private _buildInvalidInstructionForMethodData(
    reasonIdentifier: InvalidInstructionReason,
    methodData: MethodInstructionData
  ): InvalidInstruction {
    const reasonDescription = InvalidInstructionReasonDescription[reasonIdentifier];

    let description = null;
    if (reasonIdentifier === InvalidInstructionReason.UnidentifiedMethodInstruction) {
      description = StringHelper.format(reasonDescription, [methodData.alias]);
    } else {
      description = reasonDescription;
    }

    return new InvalidInstruction(reasonIdentifier, description);
  }

  private _buildInvalidInstructionForValue(reasonIdentifier: InvalidInstructionReason) {
    const reasonDescription = InvalidInstructionReasonDescription[reasonIdentifier];

    return new InvalidInstruction(reasonIdentifier, reasonDescription);
  }

  private _buildWriteNoteInstruction(instructionValue: string): Instruction {
    const note = InstructionFactoryBase._extractNoteFromInstruction(instructionValue);

    if (!note)
      return this._buildInvalidInstructionForValue(
        InvalidInstructionReason.BasicInstructionInvalid
      );

    return new WriteNoteInstruction(note);
  }

  private _getInstructionFromMethodData(methodData: MethodInstructionData): Instruction {
    if (!methodData.identifier)
      return this._buildInvalidInstructionForMethodData(
        InvalidInstructionReason.UnidentifiedMethodInstruction,
        methodData
      );

    const buildMethodInstruction = this.methodInstructionIdentifier2InstructionBuilderMap[
      methodData.identifier
    ];

    if (!buildMethodInstruction)
      return this._buildInvalidInstructionForMethodData(
        InvalidInstructionReason.UnknownMethodInstruction,
        methodData
      );

    return buildMethodInstruction(methodData);
  }

  private _getInstructionFromValue(instructionValue: string): Instruction {
    return this._buildWriteNoteInstruction(instructionValue);
  }
}
