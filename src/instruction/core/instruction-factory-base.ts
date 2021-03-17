import { StringHelper } from '../../helpers/string-helper';
import { InstructionBase } from '../core/instruction-base';
import { InvalidInstruction } from './invalid-instruction';
import {
  InvalidInstructionBaseReason,
  InvalidInstructionBaseReasonDescription,
} from './enums/invalid-instruction-base-reason';
import { Note } from '../../tab/note';
import { WriteNoteInstruction } from './write-note-instruction';

export type MethodInstructionData = {
  args: string[];
  identifier?: string | null;
  targets: InstructionData[];
};

export type InstructionData = {
  method: MethodInstructionData | null;
  value: string;
};

export type ArgumentsMinNumberValidation = {
  invalidInstructionIfLess: InvalidInstruction;
  minNumber: number;
};

export type ArgumentsMaxNumberValidation = {
  invalidInstructionIfMore: InvalidInstruction;
  maxNumber: number;
};

export type ArgumentsValidation = {
  args: string[];
  maxNumberValidation?: ArgumentsMaxNumberValidation;
  minNumberValidation?: ArgumentsMinNumberValidation;
};

export type ArgumentNumberMinValueValidation = {
  invalidInstructionIfSmaller: InvalidInstruction;
  minValue: number;
};

export type ArgumentNumberMaxValueValidation = {
  invalidInstructionIfGreater: InvalidInstruction;
  maxValue: number;
};

export type ArgumentNumberValidation = {
  arg: string;
  invalidInstructionIfNaN: InvalidInstruction;
  maxValueValidation?: ArgumentNumberMaxValueValidation;
  minValueValidation?: ArgumentNumberMinValueValidation;
};

export type TargetsMinNumberValidation = {
  invalidInstructionIfLess: InvalidInstruction;
  minNumber: number;
};

export type TargetsMaxNumberValidation = {
  invalidInstructionIfMore: InvalidInstruction;
  maxNumber: number;
};

export type TargetsValidation = {
  maxNumberValidation?: TargetsMaxNumberValidation;
  minNumberValidation?: TargetsMinNumberValidation;
  targets: InstructionData[];
};

export type MethodInstructionBuilder = (
  methodInstructionData: MethodInstructionData
) => InstructionBase;

export abstract class InstructionFactoryBase {
  private static _extractNoteFromInstruction(instruction: string): Note | null {
    const extractionRegex = /^(\d+)-(.*)/;
    const extractionResult = extractionRegex.exec(instruction);

    if (!extractionResult) return null;

    const string = Number(extractionResult[1]);
    const fret = extractionResult[2];

    return new Note(string, fret);
  }

  get methodInstructionIdentifiersEnabled(): string[] {
    return Object.keys(this.methodInstructionIdentifier2InstructionBuilderMap);
  }

  protected abstract methodInstructionIdentifier2InstructionBuilderMap: Record<
    string,
    MethodInstructionBuilder
  >;

  getInstruction(instructionData: InstructionData): InstructionBase {
    if (instructionData.method) {
      return this._getInstructionFromMethodData(instructionData.method);
    } else {
      return this._getInstructionFromValue(instructionData.value);
    }
  }

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

  private _buildInvalidInstructionBase(
    reasonIdentifier: InvalidInstructionBaseReason
  ): InvalidInstruction {
    const description = InvalidInstructionBaseReasonDescription[reasonIdentifier];

    return new InvalidInstruction(reasonIdentifier, description);
  }

  private _buildWriteNoteInstruction(instructionValue: string): InstructionBase {
    const note = InstructionFactoryBase._extractNoteFromInstruction(instructionValue);

    if (!note)
      return this._buildInvalidInstructionBase(
        InvalidInstructionBaseReason.WriteNoteInstructionInvalid
      );

    return new WriteNoteInstruction(note);
  }

  private _getInstructionFromMethodData(methodData: MethodInstructionData): InstructionBase {
    if (!methodData.identifier)
      return this._buildInvalidInstructionBase(
        InvalidInstructionBaseReason.MethodInstructionWithoutIdentifier
      );

    const buildMethodInstruction = this.methodInstructionIdentifier2InstructionBuilderMap[
      methodData.identifier
    ];

    if (!buildMethodInstruction)
      return this._buildInvalidInstructionBase(
        InvalidInstructionBaseReason.MethodInstructionWithUnmappedIdentifier
      );

    return buildMethodInstruction(methodData);
  }

  private _getInstructionFromValue(instructionValue: string): InstructionBase {
    return this._buildWriteNoteInstruction(instructionValue);
  }
}
