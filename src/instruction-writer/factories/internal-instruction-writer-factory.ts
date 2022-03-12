import { NumberType } from '../../helpers/number-helper';
import { ParsedInstructionData } from '../../parser/parsed-instruction';
import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { MethodInstruction } from '../enums/method-instruction';
import { BaseInstructionWriter } from '../instruction-writers/base-instruction-writer';
import { BaseInvalidInstructionWriter } from '../instruction-writers/base-invalid-instruction-writer';
import { BreakInstructionWriter } from '../instruction-writers/break-instruction-writer';
import { FooterInstructionWriter } from '../instruction-writers/footer-instruction-writer';
import { HeaderInstructionWriter } from '../instruction-writers/header-instruction-writer';
import { InternalInvalidInstructionWriter } from '../instruction-writers/internal-invalid-instruction-writer';
import { MergeInstructionWriter } from '../instruction-writers/merge-instruction-writer';
import { MergeableInstructionWriter } from '../instruction-writers/mergeable-instruction-writer';
import { RepeatInstructionWriter } from '../instruction-writers/repeat-instruction-writer';
import { SetSpacingInstructionWriter } from '../instruction-writers/set-spacing-instruction-writer';
import {
  BaseInstructionWriterFactory,
  MethodInstructionWriterBuilder,
} from './base-instruction-writer-factory';

/**
 * The options to create an internal instruction writer factory.
 */
export interface InternalInstructionWriterFactoryOptions {
  /**
   * The instruction method identifiers that should be handled by the factory.
   * Parsed method instructions with identifiers not handled by the factory
   * will result in the creation of invalid instruction writers.
   * @defaultValue {@link InternalInstructionWriterFactory.DEFAULT_METHOD_INSTRUCTIONS_TO_USE}
   */
  methodInstructionsToUse?: MethodInstruction[];
}

/**
 * The internal instruction writer factory. It provides support for the basic
 * instruction and the following method instructions: Break, Footer, Header,
 * Merge, Repeat and SetSpacing.
 */
export class InternalInstructionWriterFactory extends BaseInstructionWriterFactory {
  static readonly DEFAULT_METHOD_INSTRUCTIONS_TO_USE = [
    MethodInstruction.Break,
    MethodInstruction.Footer,
    MethodInstruction.Header,
    MethodInstruction.Merge,
    MethodInstruction.Repeat,
    MethodInstruction.SetSpacing,
  ];

  private static _getDefaultInstructionWriterBuilderMap(
    context: InternalInstructionWriterFactory
  ): Record<MethodInstruction, MethodInstructionWriterBuilder> {
    return {
      [MethodInstruction.Break]: context.buildBreakInstructionWriter.bind(context),
      [MethodInstruction.Footer]: context.buildFooterInstructionWriter.bind(context),
      [MethodInstruction.Header]: context.buildHeaderInstructionWriter.bind(context),
      [MethodInstruction.Merge]: context.buildMergeInstructionWriter.bind(context),
      [MethodInstruction.Repeat]: context.buildRepeatInstructionWriter.bind(context),
      [MethodInstruction.SetSpacing]: context.buildSetSpacingInstructionWriter.bind(context),
    };
  }

  private static _getInstructionWriterBuilderMap(
    context: InternalInstructionWriterFactory,
    methodInstructionsToUse: MethodInstruction[]
  ): Record<string, MethodInstructionWriterBuilder> {
    const defaultBuilderMap =
      InternalInstructionWriterFactory._getDefaultInstructionWriterBuilderMap(context);

    const instructionWriterBuilderMap = methodInstructionsToUse.reduce(
      (instructionWriterBuilderMap, methodInstructionIdentifier) => {
        instructionWriterBuilderMap[methodInstructionIdentifier] =
          defaultBuilderMap[methodInstructionIdentifier];

        return instructionWriterBuilderMap;
      },
      {} as Record<string, MethodInstructionWriterBuilder>
    );

    return instructionWriterBuilderMap;
  }

  /**
   * The map, from a method instruction identifier to a method instruction
   * writer builder, used to build instruction writers.
   */
  protected methodInstructionIdentifier2InstructionWriterBuilderMap: Record<
    string,
    MethodInstructionWriterBuilder
  >;

  /**
   * Creates an internal instruction writer factory.
   * @param options - The options to create an internal instruction writer
   * factory instance.
   */
  constructor(options: InternalInstructionWriterFactoryOptions = {}) {
    super();

    const methodInstructionsToUse =
      options.methodInstructionsToUse ||
      InternalInstructionWriterFactory.DEFAULT_METHOD_INSTRUCTIONS_TO_USE;

    this.methodInstructionIdentifier2InstructionWriterBuilderMap =
      InternalInstructionWriterFactory._getInstructionWriterBuilderMap(
        this,
        methodInstructionsToUse
      );
  }

  /**
   * Creates a break instruction writer instance.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The created instruction writer instance.
   *
   * @see {@link BreakInstructionWriter}
   */
  protected buildBreakInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    return new BreakInstructionWriter({ parsedInstruction });
  }

  /**
   * Creates a footer instruction writer instance. The parsed method instruction
   * must have one argument, the footer text that should be written to the
   * tablature element on write. It must be a non-empty string. If any of these
   * conditions are not verified, an invalid instruction writer instance will be
   * returned instead.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The created instruction writer instance.
   *
   * @see {@link FooterInstructionWriter}
   */
  protected buildFooterInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to get a write footer instruction writer. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidArgumentsInstructionWriter =
      this._validateFooterInstructionArguments(parsedInstruction);
    if (invalidArgumentsInstructionWriter) return invalidArgumentsInstructionWriter;

    const footer = parsedInstruction.method.args[0];
    return new FooterInstructionWriter({
      footer,
      parsedInstruction,
    });
  }

  /**
   * Creates a header instruction writer instance. The parsed method instruction
   * must have one argument, the header text that should be written to the
   * tablature element on write. It must be a non-empty string. If any of these
   * conditions are not verified, an invalid instruction writer instance will be
   * created instead.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The created instruction writer instance.
   *
   * @see {@link HeaderInstructionWriter}
   */
  protected buildHeaderInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to get a write header instruction writer. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidArgumentsInstructionWriter =
      this._validateHeaderInstructionArguments(parsedInstruction);
    if (invalidArgumentsInstructionWriter) return invalidArgumentsInstructionWriter;

    const header = parsedInstruction.method.args[0];
    return new HeaderInstructionWriter({
      header,
      parsedInstruction,
    });
  }

  /**
   * Creates a merge instruction writer instance. The parsed method instruction
   * must have at least one target instruction, and all targets must result in
   * mergeable instruction writer instances. There must be no set of target
   * instruction writer instances sharing the same string value. If any of these
   * conditions are not verified, an invalid instruction writer instance will be
   * created instead.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The created instruction writer instance.
   *
   * @see {@link MergeInstructionWriter}
   */
  protected buildMergeInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to get a merge instruction writer. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidTargetsInstructionWriter =
      this._validateMergeInstructionTargets(parsedInstruction);
    if (invalidTargetsInstructionWriter) return invalidTargetsInstructionWriter;

    const instructionWritersToMerge = parsedInstruction.method.targets.map(
      (targetParsedInstruction) => this.getInstructionWriter(targetParsedInstruction)
    );

    const invalidInstructionsToMergeInstructionWriter = this._validateInstructionWritersToMerge(
      parsedInstruction,
      instructionWritersToMerge
    );
    if (invalidInstructionsToMergeInstructionWriter)
      return invalidInstructionsToMergeInstructionWriter;

    return new MergeInstructionWriter({
      instructionWritersToMerge: instructionWritersToMerge as MergeableInstructionWriter[],
      parsedInstruction,
    });
  }

  /**
   * Creates a repeat instruction writer instance. The parsed method instruction
   * must have one argument, the number of repetitions, which must be an integer
   * number greater than 0. It must have at least one target instruction. If any
   * of these conditions are not verified, an invalid instruction writer instance
   * will be created instead.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The created instruction writer instance.
   *
   * @see {@link RepeatInstructionWriter}
   */
  protected buildRepeatInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to get a repeat instruction writer. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidArgumentsInstructionWriter =
      this._validateRepeatInstructionArguments(parsedInstruction);
    if (invalidArgumentsInstructionWriter) return invalidArgumentsInstructionWriter;

    const invalidTargetsInstructionWriter =
      this._validateRepeatInstructionTargets(parsedInstruction);
    if (invalidTargetsInstructionWriter) return invalidTargetsInstructionWriter;

    const numberOfRepetitions = Number(parsedInstruction.method.args[0]);
    const instructionWritersToRepeat = parsedInstruction.method.targets.map(
      (parsedTargetInstruction) => this.getInstructionWriter(parsedTargetInstruction)
    );

    return new RepeatInstructionWriter({
      instructionWritersToRepeat,
      numberOfRepetitions,
      parsedInstruction,
    });
  }

  /**
   * Creates a set spacing instruction writer instance. The parsed method
   * instruction must have one argument, the spacing value that should be set
   * to the tablature element on write. It must be greater than 0. If any of
   * these conditions are not verified, an invalid instruction writer instance
   * will be created instead.
   * @param parsedInstruction - The parsed instruction data.
   * @returns The created instruction writer instance.
   *
   * @see {@link SetSpacingInstructionWriter}
   */
  protected buildSetSpacingInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to get a set spacing instruction writer. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidArgumentsInstructionWriter =
      this._validateSetSpacingInstructionArguments(parsedInstruction);
    if (invalidArgumentsInstructionWriter) return invalidArgumentsInstructionWriter;

    const spacing = Number(parsedInstruction.method.args[0]);
    return new SetSpacingInstructionWriter({
      spacing,
      parsedInstruction,
    });
  }

  private _getConcurrentInstructionWritersToMerge(
    instructionWritersToMerge: MergeableInstructionWriter[]
  ): MergeableInstructionWriter[] {
    const noteString2InstructionWritersMap = instructionWritersToMerge.reduce(
      (noteString2InstructionWritersMap, instructionWriter) => {
        if (!noteString2InstructionWritersMap[instructionWriter.note.string]) {
          noteString2InstructionWritersMap[instructionWriter.note.string] = [];
        }

        noteString2InstructionWritersMap[instructionWriter.note.string].push(instructionWriter);

        return noteString2InstructionWritersMap;
      },
      {} as Record<string, MergeableInstructionWriter[]>
    );

    const concurrentInstructionWriters = Object.keys(noteString2InstructionWritersMap)
      .filter((noteString) => noteString2InstructionWritersMap[noteString].length > 1)
      .reduce((concurrentInstructionWriters, noteString) => {
        return concurrentInstructionWriters.concat(noteString2InstructionWritersMap[noteString]);
      }, [] as MergeableInstructionWriter[]);

    return concurrentInstructionWriters;
  }

  private _validateFooterInstructionArguments(
    parsedInstruction: ParsedInstructionData
  ): InternalInvalidInstructionWriter | null {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to validate the arguments of the write footer instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidNumberOfArgumentsInstructionWriter = this.validateNumberOfMethodArguments({
      args: parsedInstruction.method.args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionWriterIfLess: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.FooterInstructionWithoutArguments,
          parsedInstruction,
        }),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionWriterIfMore: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.FooterInstructionWithUnmappedArguments,
          parsedInstruction,
        }),
      },
    });
    if (invalidNumberOfArgumentsInstructionWriter) return invalidNumberOfArgumentsInstructionWriter;

    const footer = parsedInstruction.method.args[0];
    if (!(footer && footer.trim())) {
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.FooterInstructionWithInvalidFooter,
        parsedInstruction,
      });
    }

    return null;
  }

  private _validateHeaderInstructionArguments(
    parsedInstruction: ParsedInstructionData
  ): InternalInvalidInstructionWriter | null {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to validate the arguments of the write header instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidNumberOfArgumentsInstructionWriter = this.validateNumberOfMethodArguments({
      args: parsedInstruction.method.args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionWriterIfLess: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.HeaderInstructionWithoutArguments,
          parsedInstruction,
        }),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionWriterIfMore: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.HeaderInstructionWithUnmappedArguments,
          parsedInstruction,
        }),
      },
    });
    if (invalidNumberOfArgumentsInstructionWriter) return invalidNumberOfArgumentsInstructionWriter;

    const header = parsedInstruction.method.args[0];
    if (!(header && header.trim())) {
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.HeaderInstructionWithInvalidHeader,
        parsedInstruction,
      });
    }

    return null;
  }

  private _validateInstructionWritersToMerge(
    parsedInstruction: ParsedInstructionData,
    instructionWritersToMerge: BaseInstructionWriter[]
  ): InternalInvalidInstructionWriter | null {
    const invalidInstructionWriters = instructionWritersToMerge.filter(
      (instructionWriter) => instructionWriter instanceof BaseInvalidInstructionWriter
    );
    if (invalidInstructionWriters.length > 0) {
      return invalidInstructionWriters[0] as InternalInvalidInstructionWriter;
    }

    const unmergeableInstructionWriters = instructionWritersToMerge.filter(
      (instruction) => !(instruction instanceof MergeableInstructionWriter)
    );
    if (unmergeableInstructionWriters.length > 0) {
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.MergeInstructionWithUnmergeableTargets,
        parsedInstruction,
      });
    }

    const concurrentInstructionWriters = this._getConcurrentInstructionWritersToMerge(
      instructionWritersToMerge as MergeableInstructionWriter[]
    );
    if (concurrentInstructionWriters.length > 0) {
      return new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes,
        parsedInstruction,
      });
    }

    return null;
  }

  private _validateMergeInstructionTargets(
    parsedInstruction: ParsedInstructionData
  ): InternalInvalidInstructionWriter | null {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to validate the targets of the merge instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidTargetsInstructionWriter = this.validateNumberOfMethodTargets({
      targets: parsedInstruction.method.targets,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionWriterIfLess: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.MergeInstructionWithoutTargets,
          parsedInstruction,
        }),
      },
    });

    return invalidTargetsInstructionWriter;
  }

  private _validateRepeatInstructionArguments(
    parsedInstruction: ParsedInstructionData
  ): InternalInvalidInstructionWriter | null {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to validate the arguments of the repeat instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidNumberOfArgumentsInstructionWriter = this.validateNumberOfMethodArguments({
      args: parsedInstruction.method.args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionWriterIfLess: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.RepeatInstructionWithoutArguments,
          parsedInstruction,
        }),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionWriterIfMore: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.RepeatInstructionWithUnmappedArguments,
          parsedInstruction,
        }),
      },
    });
    if (invalidNumberOfArgumentsInstructionWriter) return invalidNumberOfArgumentsInstructionWriter;

    const invalidRepetitionsValueInstructionWriter = this.validateMethodArgumentForNumberValue({
      arg: parsedInstruction.method.args[0],
      invalidInstructionWriterIfNaN: new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType,
        parsedInstruction,
      }),
      numberTypeValidation: {
        allowedTypes: [NumberType.Integer],
        invalidInstructionWriterIfTypeNotAllowed: new InternalInvalidInstructionWriter({
          reasonIdentifier:
            InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType,
          parsedInstruction,
        }),
      },
      minValueValidation: {
        minValue: 1,
        invalidInstructionWriterIfSmaller: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue,
          parsedInstruction,
        }),
      },
    });
    if (invalidRepetitionsValueInstructionWriter) return invalidRepetitionsValueInstructionWriter;

    return null;
  }

  private _validateRepeatInstructionTargets(
    parsedInstruction: ParsedInstructionData
  ): InternalInvalidInstructionWriter | null {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to validate the targets of the repeat instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidTargetsInstructionWriter = this.validateNumberOfMethodTargets({
      targets: parsedInstruction.method.targets,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionWriterIfLess: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.RepeatInstructionWithoutTargets,
          parsedInstruction,
        }),
      },
    });
    if (invalidTargetsInstructionWriter) return invalidTargetsInstructionWriter;

    return null;
  }

  private _validateSetSpacingInstructionArguments(
    parsedInstruction: ParsedInstructionData
  ): InternalInvalidInstructionWriter | null {
    if (!parsedInstruction.method)
      throw new Error(
        'Failed to validate the arguments of the set spacing instruction. ' +
          'The "method" property is empty on the given parsed instruction.'
      );

    const invalidNumberOfArgumentsInstructionWriter = this.validateNumberOfMethodArguments({
      args: parsedInstruction.method.args,
      minNumberValidation: {
        minNumber: 1,
        invalidInstructionWriterIfLess: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.SpacingInstructionWithoutArguments,
          parsedInstruction,
        }),
      },
      maxNumberValidation: {
        maxNumber: 1,
        invalidInstructionWriterIfMore: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.SpacingInstructionWithUnmappedArguments,
          parsedInstruction,
        }),
      },
    });
    if (invalidNumberOfArgumentsInstructionWriter) return invalidNumberOfArgumentsInstructionWriter;

    const invalidSpacingValueInstructionWriter = this.validateMethodArgumentForNumberValue({
      arg: parsedInstruction.method.args[0],
      invalidInstructionWriterIfNaN: new InternalInvalidInstructionWriter({
        reasonIdentifier: InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValueType,
        parsedInstruction,
      }),
      numberTypeValidation: {
        allowedTypes: [NumberType.Integer],
        invalidInstructionWriterIfTypeNotAllowed: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValueType,
          parsedInstruction,
        }),
      },
      minValueValidation: {
        minValue: 1,
        invalidInstructionWriterIfSmaller: new InternalInvalidInstructionWriter({
          reasonIdentifier: InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValue,
          parsedInstruction,
        }),
      },
    });
    if (invalidSpacingValueInstructionWriter) return invalidSpacingValueInstructionWriter;

    return null;
  }
}
