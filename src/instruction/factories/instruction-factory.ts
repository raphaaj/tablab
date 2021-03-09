import { InstructionMethodIdentifier } from '../enums/instruction-method-identifier';
import {
  InstructionFactoryBase,
  InstructionBuilder,
  InstructionMethodData,
  InstructionData,
} from '../core/instruction-factory-base';
import {
  InvalidInstructionReason,
  InvalidInstructionReasonDescription,
} from '../enums/invalid-instruction-reason';
import { InstructionBase } from '../core/instruction-base';
import { MergeableInstructionBase } from '../core/mergeable-instruction-base';
import { InvalidInstruction } from '../core/invalid-instruction';
import { BreakInstruction } from '../instructions/break-instruction';
import { MergeInstruction } from '../instructions/merge-instruction';
import { RepeatInstruction } from '../instructions/repeat-instruction';
import { SetSpacingInstruction } from '../instructions/set-spacing-instruction';
import { WriteFooterInstruction } from '../instructions/write-footer-instruction';
import { WriteHeaderInstruction } from '../instructions/write-header-instruction';

export type InstructionFactoryData = {
  useMethods?: InstructionMethodIdentifier[];
};

export class InstructionFactory extends InstructionFactoryBase {
  static readonly DEFAULT_METHODS_TO_USE = [
    InstructionMethodIdentifier.Break,
    InstructionMethodIdentifier.Merge,
    InstructionMethodIdentifier.Repeat,
    InstructionMethodIdentifier.SetSpacing,
    InstructionMethodIdentifier.WriteHeader,
    InstructionMethodIdentifier.WriteFooter,
  ];

  private static _getDefaultInstructionBuilderMap(
    context: InstructionFactory
  ): Record<InstructionMethodIdentifier, InstructionBuilder> {
    return {
      [InstructionMethodIdentifier.Break]: context.buildBreakInstruction.bind(context),
      [InstructionMethodIdentifier.Merge]: context.buildMergeInstruction.bind(context),
      [InstructionMethodIdentifier.Repeat]: context.buildRepeatInstruction.bind(context),
      [InstructionMethodIdentifier.SetSpacing]: context.buildSetSpacingInstruction.bind(context),
      [InstructionMethodIdentifier.WriteHeader]: context.buildWriteHeaderInstruction.bind(context),
      [InstructionMethodIdentifier.WriteFooter]: context.buildWriteFooterInstruction.bind(context),
    };
  }

  private static _getInstructionBuilderMap(
    context: InstructionFactory,
    methodsToUse: InstructionMethodIdentifier[]
  ): Record<string, InstructionBuilder> {
    const defaultBuilderMap = InstructionFactory._getDefaultInstructionBuilderMap(context);

    const builderMap = methodsToUse.reduce((builderMap, methodIdentifier) => {
      builderMap[methodIdentifier] = defaultBuilderMap[methodIdentifier];

      return builderMap;
    }, {} as Record<string, InstructionBuilder>);

    return builderMap;
  }

  protected instructionMethodIdentifier2InstructionBuilderMap: Record<string, InstructionBuilder>;

  constructor({ useMethods }: InstructionFactoryData = {}) {
    super();

    const methodsToUse = useMethods || InstructionFactory.DEFAULT_METHODS_TO_USE;

    this.instructionMethodIdentifier2InstructionBuilderMap = InstructionFactory._getInstructionBuilderMap(
      this,
      methodsToUse
    );
  }

  protected buildBreakInstruction(): InstructionBase {
    return new BreakInstruction();
  }

  protected buildMergeInstruction(methodData: InstructionMethodData): InstructionBase {
    const invalidTargets = this._validateMergeInstructionTargets(methodData.targets);
    if (invalidTargets) return invalidTargets;

    const instructionsToMerge = methodData.targets.map((targetInstructionData) =>
      this.getInstruction(targetInstructionData)
    );

    const invalidInstructionsToMerge = this._validateInstructionsToMerge(instructionsToMerge);
    if (invalidInstructionsToMerge) return invalidInstructionsToMerge;

    return new MergeInstruction(instructionsToMerge as MergeableInstructionBase[]);
  }

  protected buildRepeatInstruction(methodData: InstructionMethodData): InstructionBase {
    const invalidArguments = this._validateRepeatInstructionArguments(methodData.args);
    if (invalidArguments) return invalidArguments;

    const invalidTargets = this._validateRepeatInstructionTargets(methodData.targets);
    if (invalidTargets) return invalidTargets;

    const repetitions = Number(methodData.args[0]);
    const instructionsToRepeat = methodData.targets.map((targetData) =>
      this.getInstruction(targetData)
    );

    return new RepeatInstruction(instructionsToRepeat, repetitions);
  }

  protected buildSetSpacingInstruction(methodData: InstructionMethodData): InstructionBase {
    const invalidArguments = this._validateSetSpacingInstructionArguments(methodData.args);
    if (invalidArguments) return invalidArguments;

    const spacing = Number(methodData.args[0]);
    return new SetSpacingInstruction(spacing);
  }

  protected buildWriteFooterInstruction(methodData: InstructionMethodData): InstructionBase {
    const invalidArguments = this._validateWriteFooterInstructionArguments(methodData.args);
    if (invalidArguments) return invalidArguments;

    const footer = methodData.args[0];
    return new WriteFooterInstruction(footer);
  }

  protected buildWriteHeaderInstruction(methodData: InstructionMethodData): InstructionBase {
    const invalidArguments = this._validateWriteHeaderInstructionArguments(methodData.args);
    if (invalidArguments) return invalidArguments;

    const header = methodData.args[0];
    return new WriteHeaderInstruction(header);
  }

  private _buildInvalidInstruction(reasonIdentifier: InvalidInstructionReason): InvalidInstruction {
    const description = InvalidInstructionReasonDescription[reasonIdentifier];

    return new InvalidInstruction(reasonIdentifier, description);
  }

  private _getConcurrentInstructionsToMerge(
    instructions: MergeableInstructionBase[]
  ): MergeableInstructionBase[] {
    const noteString2InstructionsMap = instructions.reduce(
      (string2InstructionsMap, instruction) => {
        if (!string2InstructionsMap[instruction.note.string]) {
          string2InstructionsMap[instruction.note.string] = [];
        }

        string2InstructionsMap[instruction.note.string].push(instruction);

        return string2InstructionsMap;
      },
      {} as Record<string, MergeableInstructionBase[]>
    );

    const concurrentInstructions = Object.keys(noteString2InstructionsMap)
      .filter((noteString) => noteString2InstructionsMap[noteString].length > 1)
      .flatMap((noteString) => noteString2InstructionsMap[noteString]);

    return concurrentInstructions;
  }

  private _validateInstructionsToMerge(instructions: InstructionBase[]): InvalidInstruction | null {
    const invalidInstructions = instructions.filter(
      (instruction) => instruction instanceof InvalidInstruction
    );
    if (invalidInstructions.length > 0) {
      return invalidInstructions[0] as InvalidInstruction;
    }

    const nonMergeableInstructions = instructions.filter(
      (instruction) => !(instruction instanceof MergeableInstructionBase)
    );
    if (nonMergeableInstructions.length > 0) {
      return this._buildInvalidInstruction(
        InvalidInstructionReason.MergeInstructionWithUnmergeableTargets
      );
    }

    const concurrentInstructions = this._getConcurrentInstructionsToMerge(
      instructions as MergeableInstructionBase[]
    );
    if (concurrentInstructions.length > 0) {
      return this._buildInvalidInstruction(
        InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes
      );
    }

    return null;
  }

  private _validateMergeInstructionTargets(targets: InstructionData[]): InvalidInstruction | null {
    const invalidTargets = this.validateNumberOfTargets({
      targets: targets,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionIfLess: this._buildInvalidInstruction(
          InvalidInstructionReason.MergeInstructionWithoutTargets
        ),
      },
    });

    return invalidTargets;
  }

  private _validateRepeatInstructionArguments(args: string[]): InvalidInstruction | null {
    const invalidNumberOfArguments = this.validateNumberOfMethodArguments({
      args: args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionIfLess: this._buildInvalidInstruction(
          InvalidInstructionReason.RepeatInstructionWithoutArguments
        ),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionIfMore: this._buildInvalidInstruction(
          InvalidInstructionReason.RepeatInstructionWithUnmappedArguments
        ),
      },
    });
    if (invalidNumberOfArguments) return invalidNumberOfArguments;

    const invalidRepetitionsValue = this.validateMethodArgumentForNumberValue({
      arg: args[0],
      invalidInstructionIfNaN: this._buildInvalidInstruction(
        InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType
      ),
      minValueValidation: {
        minValue: 1,
        invalidInstructionIfSmaller: this._buildInvalidInstruction(
          InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue
        ),
      },
    });
    if (invalidRepetitionsValue) return invalidRepetitionsValue;

    return null;
  }

  private _validateRepeatInstructionTargets(targets: InstructionData[]): InvalidInstruction | null {
    const invalidTargets = this.validateNumberOfTargets({
      targets: targets,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionIfLess: this._buildInvalidInstruction(
          InvalidInstructionReason.RepeatInstructionWithoutTargets
        ),
      },
    });
    if (invalidTargets) return invalidTargets;

    return null;
  }

  private _validateSetSpacingInstructionArguments(args: string[]): InvalidInstruction | null {
    const invalidNumberOfArguments = this.validateNumberOfMethodArguments({
      args: args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionIfLess: this._buildInvalidInstruction(
          InvalidInstructionReason.SetSpacingInstructionWithoutArguments
        ),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionIfMore: this._buildInvalidInstruction(
          InvalidInstructionReason.SetSpacingInstructionWithUnmappedArguments
        ),
      },
    });
    if (invalidNumberOfArguments) return invalidNumberOfArguments;

    const invalidSpacingValue = this.validateMethodArgumentForNumberValue({
      arg: args[0],
      invalidInstructionIfNaN: this._buildInvalidInstruction(
        InvalidInstructionReason.SetSpacingInstructionWithInvalidSpacingValueType
      ),
      minValueValidation: {
        minValue: 1,
        invalidInstructionIfSmaller: this._buildInvalidInstruction(
          InvalidInstructionReason.SetSpacingInstructionWithInvalidSpacingValue
        ),
      },
    });
    if (invalidSpacingValue) return invalidSpacingValue;

    return null;
  }

  private _validateWriteFooterInstructionArguments(args: string[]): InvalidInstruction | null {
    const invalidNumberOfArguments = this.validateNumberOfMethodArguments({
      args: args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionIfLess: this._buildInvalidInstruction(
          InvalidInstructionReason.WriteFooterInstructionWithoutArguments
        ),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionIfMore: this._buildInvalidInstruction(
          InvalidInstructionReason.WriteFooterInstructionWithUnmappedArguments
        ),
      },
    });
    if (invalidNumberOfArguments) return invalidNumberOfArguments;

    const footer = args[0];
    if (!(footer && footer.trim())) {
      return this._buildInvalidInstruction(
        InvalidInstructionReason.WriteFooterInstructionWithInvalidFooter
      );
    }

    return null;
  }

  private _validateWriteHeaderInstructionArguments(args: string[]): InvalidInstruction | null {
    const invalidNumberOfArguments = this.validateNumberOfMethodArguments({
      args: args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionIfLess: this._buildInvalidInstruction(
          InvalidInstructionReason.WriteHeaderInstructionWithoutArguments
        ),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionIfMore: this._buildInvalidInstruction(
          InvalidInstructionReason.WriteHeaderInstructionWithUnmappedArguments
        ),
      },
    });
    if (invalidNumberOfArguments) return invalidNumberOfArguments;

    const header = args[0];
    if (!(header && header.trim())) {
      return this._buildInvalidInstruction(
        InvalidInstructionReason.WriteHeaderInstructionWithInvalidHeader
      );
    }

    return null;
  }
}
