import { MethodInstructionIdentifier } from '../enums/method-instruction-identifier';
import {
  InstructionFactoryBase,
  MethodInstructionBuilder,
  MethodInstructionData,
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

/**
 * The options to create an instruction factory.
 */
export interface InstructionFactoryOptions {
  /**
   * The instruction method identifiers that should be handled
   * by the factory. Method instructions with identifiers not
   * handled by the factory will result in the creation of invalid
   * instructions.
   * @defaultValue {@link InstructionFactory.DEFAULT_METHODS_TO_USE}
   */
  useMethods?: MethodInstructionIdentifier[];
}

export class InstructionFactory extends InstructionFactoryBase {
  static readonly DEFAULT_METHODS_TO_USE = [
    MethodInstructionIdentifier.Break,
    MethodInstructionIdentifier.Merge,
    MethodInstructionIdentifier.Repeat,
    MethodInstructionIdentifier.SetSpacing,
    MethodInstructionIdentifier.WriteHeader,
    MethodInstructionIdentifier.WriteFooter,
  ];

  private static _getDefaultMethodInstructionBuilderMap(
    context: InstructionFactory
  ): Record<MethodInstructionIdentifier, MethodInstructionBuilder> {
    return {
      [MethodInstructionIdentifier.Break]: context.buildBreakInstruction.bind(context),
      [MethodInstructionIdentifier.Merge]: context.buildMergeInstruction.bind(context),
      [MethodInstructionIdentifier.Repeat]: context.buildRepeatInstruction.bind(context),
      [MethodInstructionIdentifier.SetSpacing]: context.buildSetSpacingInstruction.bind(context),
      [MethodInstructionIdentifier.WriteHeader]: context.buildWriteHeaderInstruction.bind(context),
      [MethodInstructionIdentifier.WriteFooter]: context.buildWriteFooterInstruction.bind(context),
    };
  }

  private static _getMethodInstructionBuilderMap(
    context: InstructionFactory,
    methodsToUse: MethodInstructionIdentifier[]
  ): Record<string, MethodInstructionBuilder> {
    const defaultBuilderMap = InstructionFactory._getDefaultMethodInstructionBuilderMap(context);

    const builderMap = methodsToUse.reduce((builderMap, methodIdentifier) => {
      builderMap[methodIdentifier] = defaultBuilderMap[methodIdentifier];

      return builderMap;
    }, {} as Record<string, MethodInstructionBuilder>);

    return builderMap;
  }

  protected methodInstructionIdentifier2InstructionBuilderMap: Record<
    string,
    MethodInstructionBuilder
  >;

  /**
   * Creates an instruction factory.
   * @param options - The options used to create the instruction factory.
   */
  constructor(options: InstructionFactoryOptions = {}) {
    super();

    const { useMethods } = options;

    const methodsToUse = useMethods || InstructionFactory.DEFAULT_METHODS_TO_USE;

    this.methodInstructionIdentifier2InstructionBuilderMap = InstructionFactory._getMethodInstructionBuilderMap(
      this,
      methodsToUse
    );
  }

  /**
   * Creates a break instruction instance.
   * @returns The created instruction instance.
   *
   * @see {@link BreakInstruction}
   */
  protected buildBreakInstruction(): InstructionBase {
    return new BreakInstruction();
  }

  /**
   * Creates a merge instruction instance. It must have at least one target
   * instruction, and all targets must result in mergeable instruction instances.
   * There must be no set of target instruction instances sharing the same
   * string value. If any of these conditions are not verified, an invalid
   * instruction instance will be created instead.
   * @param methodData - The method instruction data.
   * @returns The created instruction instance.
   *
   * @see {@link MergeInstruction}
   */
  protected buildMergeInstruction(methodData: MethodInstructionData): InstructionBase {
    const invalidTargets = this._validateMergeInstructionTargets(methodData.targets);
    if (invalidTargets) return invalidTargets;

    const instructionsToMerge = methodData.targets.map((targetInstructionData) =>
      this.getInstruction(targetInstructionData)
    );

    const invalidInstructionsToMerge = this._validateInstructionsToMerge(instructionsToMerge);
    if (invalidInstructionsToMerge) return invalidInstructionsToMerge;

    return new MergeInstruction(instructionsToMerge as MergeableInstructionBase[]);
  }

  /**
   * Creates a repeat instruction instance. It must have one argument, the
   * number of repetitions, which must be an integer number greater than 0.
   * It must have at least one target instruction. If any of these conditions
   * are not verified, an invalid instruction instance will be created instead.
   * @param methodData - The method instruction data.
   * @returns The created instruction instance.
   *
   * @see {@link RepeatInstruction}
   */
  protected buildRepeatInstruction(methodData: MethodInstructionData): InstructionBase {
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

  /**
   * Creates a set spacing instruction instance. It must have one argument,
   * the new spacing value of the tablature element, which must be greater
   * than 0. If any of these conditions are not verified, an invalid
   * instruction instance will be created instead.
   * @param methodData - The method instruction data.
   * @returns The created instruction instance.
   *
   * @see {@link SetSpacingInstruction}
   */
  protected buildSetSpacingInstruction(methodData: MethodInstructionData): InstructionBase {
    const invalidArguments = this._validateSetSpacingInstructionArguments(methodData.args);
    if (invalidArguments) return invalidArguments;

    const spacing = Number(methodData.args[0]);
    return new SetSpacingInstruction(spacing);
  }

  /**
   * Creates a write footer instruction instance. It must have one argument,
   * the footer to write to the tablature element, which must be a non-empty
   * string. If any of these conditions are not verified, an invalid instruction
   * instance will be created instead.
   * @param methodData - The method instruction data.
   * @returns The created instruction instance.
   *
   * @see {@link WriteFooter}
   */
  protected buildWriteFooterInstruction(methodData: MethodInstructionData): InstructionBase {
    const invalidArguments = this._validateWriteFooterInstructionArguments(methodData.args);
    if (invalidArguments) return invalidArguments;

    const footer = methodData.args[0];
    return new WriteFooterInstruction(footer);
  }

  /**
   * Creates a write header instruction instance. It must have one argument,
   * the header to write to the tablature element, which must be a non-empty
   * string. If any of these conditions are not verified, an invalid instruction
   * instance will be created instead.
   * @param methodData - The method instruction data.
   * @returns The created instruction instance.
   *
   * @see {@link WriteHeader}
   */
  protected buildWriteHeaderInstruction(methodData: MethodInstructionData): InstructionBase {
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
      .reduce((concurrentInstructions, noteString) => {
        return concurrentInstructions.concat(noteString2InstructionsMap[noteString]);
      }, [] as MergeableInstructionBase[]);

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
