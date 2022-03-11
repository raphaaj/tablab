import { StringHelper } from '../../helpers/string-helper';
import { ParsedInstructionData } from '../../parser/parsed-instruction';
import { Note } from '../../tab/note';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { BaseInstructionWriter } from '../instruction-writers/base-instruction-writer';
import { BaseInvalidInstructionWriter } from '../instruction-writers/base-invalid-instruction-writer';
import { InternalInvalidInstructionWriter } from '../instruction-writers/internal-invalid-instruction-writer';
import { NoteInstructionWriter } from '../instruction-writers/note-instruction-writer';

/**
 * An instruction writer provider.
 */
export interface InstructionWriterProvider {
  /**
   * Creates an instruction writer instance from parsed instruction data. The
   * instruction writer created can then be used to write the instruction to a
   * tablature element.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The instruction writer instance created.
   */
  getInstructionWriter(parsedInstruction: ParsedInstructionData): BaseInstructionWriter;
}

/**
 * The options to perform a validation for a minimum number of arguments
 * of a method instruction.
 */
export type ArgumentsMinNumberValidationOptions = {
  /**
   * The invalid instruction writer to be returned if the number of
   * arguments verified is smaller than the minimum number specified.
   */
  invalidInstructionWriterIfLess: BaseInvalidInstructionWriter;

  /**
   * The minimum number of arguments allowed.
   */
  minNumber: number;
};

/**
 * The options to perform a validation for a maximum number of arguments
 * of a method instruction.
 */
export type ArgumentsMaxNumberValidationOptions = {
  /**
   * The invalid instruction writer to be returned if the number of
   * arguments verified is greater than the maximum number specified.
   */
  invalidInstructionWriterIfMore: BaseInvalidInstructionWriter;

  /**
   * The maximum number of arguments allowed.
   */
  maxNumber: number;
};

/**
 * The options to perform a validation of the number of arguments
 * of a method instruction.
 */
export type ArgumentsValidationOptions = {
  /**
   * The arguments to validate.
   */
  args: string[];

  /**
   * The options to validate for a maximum number of arguments.
   */
  maxNumberValidation?: ArgumentsMaxNumberValidationOptions;

  /**
   * The options to validate for a minimum number of arguments.
   */
  minNumberValidation?: ArgumentsMinNumberValidationOptions;
};

/**
 * The options to perform a validation of a method instruction single
 * argument for a minimum number value.
 */
export type ArgumentNumberMinValueValidationOptions = {
  /**
   * The invalid instruction writer to be returned if the given argument
   * is a number smaller than the minimum allowed value.
   */
  invalidInstructionWriterIfSmaller: BaseInvalidInstructionWriter;

  /**
   * The minimum allowed value.
   */
  minValue: number;
};

/**
 * The options to perform a validation of a method instruction single
 * argument for a maximum number value.
 */
export type ArgumentNumberMaxValueValidationOptions = {
  /**
   * The invalid instruction writer to be returned if the given argument
   * is a number greater than the maximum allowed value.
   */
  invalidInstructionWriterIfGreater: BaseInvalidInstructionWriter;

  /**
   * The maximum allowed value.
   */
  maxValue: number;
};

/**
 * The options to perform a validation of a method instruction single
 * argument for a number value.
 */
export type ArgumentNumberValidationOptions = {
  /**
   * The argument value to validate for a number.
   */
  arg: string;

  /**
   * The invalid instruction writer to be returned if the given argument
   * is not a valid number.
   */
  invalidInstructionWriterIfNaN: BaseInvalidInstructionWriter;

  /**
   * The options to validate for a maximum value.
   */
  maxValueValidation?: ArgumentNumberMaxValueValidationOptions;

  /**
   * The options to validate for a minimum value.
   */
  minValueValidation?: ArgumentNumberMinValueValidationOptions;
};

/**
 * The options to perform a validation for a minimum number of targets
 * of a method instruction.
 */
export type TargetsMinNumberValidationOptions = {
  /**
   * The invalid instruction writer to be returned if the number of
   * targets verified is smaller than the minimum number specified.
   */
  invalidInstructionWriterIfLess: BaseInvalidInstructionWriter;

  /**
   * The minimum number of targets allowed.
   */
  minNumber: number;
};

/**
 * The options to perform a validation for a maximum number of targets
 * of a method instruction.
 */
export type TargetsMaxNumberValidationOptions = {
  /**
   * The invalid instruction writer to be returned if the number of
   * targets verified is greater than the maximum number specified.
   */
  invalidInstructionWriterIfMore: BaseInvalidInstructionWriter;

  /**
   * The maximum number of targets allowed.
   */
  maxNumber: number;
};

/**
 * The options to perform a validation of the number of targets
 * of a method instruction.
 */
export type TargetsValidationOptions = {
  /**
   * The options to validate for a maximum number of targets.
   */
  maxNumberValidation?: TargetsMaxNumberValidationOptions;

  /**
   * The options to validate for a minimum number of targets.
   */
  minNumberValidation?: TargetsMinNumberValidationOptions;

  /**
   * The targets to validate.
   */
  targets: ParsedInstructionData[];
};

export type MethodInstructionWriterBuilder = (
  parsedInstruction: ParsedInstructionData
) => BaseInstructionWriter;

/**
 * The "base" instruction writer factory. It provides support for basic
 * and method instructions.
 *
 * The base class for all instruction writer factories.
 */
export abstract class BaseInstructionWriterFactory implements InstructionWriterProvider {
  private static _extractNoteFromParsedInstructionValue(instructionValue: string): Note | null {
    const noteExtractionRegex = /^(\d+)-(.*)/;
    const noteExtractionResult = noteExtractionRegex.exec(instructionValue);

    if (!noteExtractionResult) return null;

    const string = Number(noteExtractionResult[1]);
    const fret = noteExtractionResult[2];

    return new Note(string, fret);
  }

  /**
   * The method instructions handled by the instruction writer factory.
   */
  get methodInstructionsEnabled(): string[] {
    return Object.keys(this.methodInstructionIdentifier2InstructionWriterBuilderMap);
  }

  /**
   * The map, from a method instruction identifier to a method instruction
   * writer builder, used to build instruction writers.
   */
  protected abstract methodInstructionIdentifier2InstructionWriterBuilderMap: Record<
    string,
    MethodInstructionWriterBuilder
  >;

  /**
   * Creates an instruction writer instance from parsed instruction data. The
   * instruction writer created can then be used to write the instruction to a
   * tablature element.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The instruction writer instance created.
   */
  getInstructionWriter(parsedInstruction: ParsedInstructionData): BaseInstructionWriter {
    if (parsedInstruction.method) {
      return this._getInstructionWriterForMethodInstruction(parsedInstruction);
    } else {
      return this._getInstructionWriterForBasicInstruction(parsedInstruction);
    }
  }

  /**
   * Validates a method instruction single argument for a number value. It is
   * possible to validate for a minimum and a maximum value.
   * @param argumentValidationOptions - The options to perform the validation.
   * @returns `null` if all validation conditions are verified, the given invalid
   * instruction writer instance, that corresponds to the failure reason, otherwise.
   */
  protected validateMethodArgumentForNumberValue(
    argumentValidationOptions: ArgumentNumberValidationOptions
  ): BaseInvalidInstructionWriter | null {
    if (!StringHelper.isNumber(argumentValidationOptions.arg)) {
      return argumentValidationOptions.invalidInstructionWriterIfNaN;
    }

    const argumentAsNumber = Number(argumentValidationOptions.arg);
    if (
      argumentValidationOptions.minValueValidation !== undefined &&
      argumentAsNumber < argumentValidationOptions.minValueValidation.minValue
    ) {
      return argumentValidationOptions.minValueValidation.invalidInstructionWriterIfSmaller;
    }

    if (
      argumentValidationOptions.maxValueValidation !== undefined &&
      argumentAsNumber > argumentValidationOptions.maxValueValidation.maxValue
    ) {
      return argumentValidationOptions.maxValueValidation.invalidInstructionWriterIfGreater;
    }

    return null;
  }

  /**
   * Validates the number of arguments of a method instruction. It is
   * possible to validate for a minimum and a maximum number of arguments.
   * @param argumentsValidationOptions - The options to perform the validation.
   * @returns `null` if all validation conditions are verified, the given invalid
   * instruction writer instance, that corresponds to the failure reason, otherwise.
   */
  protected validateNumberOfMethodArguments(
    argumentsValidationOptions: ArgumentsValidationOptions
  ): BaseInvalidInstructionWriter | null {
    if (
      argumentsValidationOptions.minNumberValidation !== undefined &&
      argumentsValidationOptions.args.length <
        argumentsValidationOptions.minNumberValidation.minNumber
    ) {
      return argumentsValidationOptions.minNumberValidation.invalidInstructionWriterIfLess;
    }

    if (
      argumentsValidationOptions.maxNumberValidation !== undefined &&
      argumentsValidationOptions.args.length >
        argumentsValidationOptions.maxNumberValidation.maxNumber
    ) {
      return argumentsValidationOptions.maxNumberValidation.invalidInstructionWriterIfMore;
    }

    return null;
  }

  /**
   * Validates the number of targets of a method instruction. It is possible
   * to validate for a minimum and a maximum number of targets.
   * @param targetsValidationOptions - The options to perform the validation.
   * @returns `null` if all validation conditions are verified, the given invalid
   * instruction writer instance, that corresponds to the failure reason, otherwise.
   */
  protected validateNumberOfMethodTargets(
    targetsValidationOptions: TargetsValidationOptions
  ): BaseInvalidInstructionWriter | null {
    if (
      targetsValidationOptions.minNumberValidation !== undefined &&
      targetsValidationOptions.targets.length <
        targetsValidationOptions.minNumberValidation.minNumber
    ) {
      return targetsValidationOptions.minNumberValidation.invalidInstructionWriterIfLess;
    }

    if (
      targetsValidationOptions.maxNumberValidation !== undefined &&
      targetsValidationOptions.targets.length >
        targetsValidationOptions.maxNumberValidation.maxNumber
    ) {
      return targetsValidationOptions.maxNumberValidation.invalidInstructionWriterIfMore;
    }

    return null;
  }

  private _buildNoteInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    const note = BaseInstructionWriterFactory._extractNoteFromParsedInstructionValue(
      parsedInstruction.value
    );

    if (!note)
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.BasicInstructionInvalid,
        parsedInstruction,
      });

    return new NoteInstructionWriter({
      note: note,
      parsedInstruction,
    });
  }

  private _getInstructionWriterForBasicInstruction(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    return this._buildNoteInstructionWriter(parsedInstruction);
  }

  private _getInstructionWriterForMethodInstruction(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to get an instruction writer for a method instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    if (!parsedInstruction.method.identifier)
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.UnidentifiedMethodInstruction,
        parsedInstruction,
      });

    const buildInstructionWriter =
      this.methodInstructionIdentifier2InstructionWriterBuilderMap[
        parsedInstruction.method.identifier
      ];

    if (!buildInstructionWriter)
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.UnknownMethodInstruction,
        parsedInstruction,
      });

    return buildInstructionWriter(parsedInstruction);
  }
}
