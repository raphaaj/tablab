import { Enclosure, EnclosuresHelper } from '../helpers/enclosures-helper';
import { StringHelper } from '../helpers/string-helper';
import { MethodInstruction } from '../instruction-writer/enums/method-instruction';
import { InstructionWriterProvider } from '../instruction-writer/factories/base-instruction-writer-factory';
import { InternalInstructionWriterFactory } from '../instruction-writer/factories/internal-instruction-writer-factory';
import { ParsedInstruction } from './parsed-instruction';
import { ParsedMethodInstruction } from './parsed-method-instruction';

/**
 * The options to create a parser.
 */
export interface ParserOptions {
  /**
   * The instruction writer provider to be used to create instruction writer
   * instances.
   *
   * @defaultValue The default value is a new instance of the class
   * {@link InternalInstructionWriterFactory}.
   */
  instructionWriterProvider?: InstructionWriterProvider;

  /**
   * The map from a method instruction alias to a method instruction identifier
   * to be used while parsing method instructions. Whenever a method instruction
   * is parsed the method identifier will be determined from its method alias
   * using this map.
   *
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP}
   */
  methodInstructionAlias2IdentifierMap?: Record<string, string>;

  /**
   * The enclosure type to be used to identify the method instruction arguments
   * while parsing method instructions. It must be different from the value of
   * `methodInstructionTargetsEnclosure`.
   *
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_ENCLOSURE}
   */
  methodInstructionArgsEnclosure?: Enclosure;

  /**
   * The character to be considered as the separator of the arguments of a method
   * instruction. It must be a string with a single character.
   *
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR}
   */
  methodInstructionArgsSeparator?: string;

  /**
   * The enclosure type to be used to identify the method instruction targets
   * while parsing method instructions. It must be different from the value of
   * `methodInstructionArgsEnclosure`.
   *
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_ENCLOSURE}
   */
  methodInstructionTargetsEnclosure?: Enclosure;
}

/**
 * An instructions parser.
 */
export class Parser {
  static readonly DEFAULT_INSTRUCTIONS_SEPARATOR = ' ';
  static readonly DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP: Record<string, string> = {
    break: MethodInstruction.Break,
    footer: MethodInstruction.Footer,
    header: MethodInstruction.Header,
    merge: MethodInstruction.Merge,
    repeat: MethodInstruction.Repeat,
    spacing: MethodInstruction.SetSpacing,
  };
  static readonly DEFAULT_METHOD_INSTRUCTION_ARGS_ENCLOSURE = Enclosure.Parentheses;
  static readonly DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR = ',';
  static readonly DEFAULT_METHOD_INSTRUCTION_TARGETS_ENCLOSURE = Enclosure.CurlyBrackets;

  /**
   * The enclosure type used to identify the method instruction arguments while
   * parsing method instructions. It must be different from the value of
   * `methodInstructionTargetsEnclosure`.
   */
  get methodInstructionArgsEnclosure(): Enclosure {
    return this._methodInstructionArgsEnclosure;
  }
  set methodInstructionArgsEnclosure(value: Enclosure) {
    if (value === this.methodInstructionTargetsEnclosure) {
      throw new Error(
        'Invalid value for property "methodInstructionArgsEnclosure". ' +
          'It must be different from the value of the "methodInstructionTargetsEnclosure" property. ' +
          `Received value was "${value}"`
      );
    }

    this._methodInstructionArgsEnclosure = value;
  }

  /**
   * The character considered as the separator of the arguments of a method
   * instruction. It must be a single character string.
   */
  get methodInstructionArgsSeparator(): string {
    return this._methodInstructionArgsSeparator;
  }
  set methodInstructionArgsSeparator(value: string) {
    if (value.length !== 1)
      throw new Error(
        'Invalid value for porperty "methodInstructionArgsSeparator". ' +
          'It must be a single character string. ' +
          `Received value was "${value}"`
      );
    this._methodInstructionArgsSeparator = value;
  }

  /**
   * The enclosure type used to identify the method instruction targets while
   * parsing method instructions. It must be different from the value of
   * `methodInstructionArgsEnclosure`.
   */
  get methodInstructionTargetsEnclosure(): Enclosure {
    return this._methodInstructionTargetsEnclosure;
  }
  set methodInstructionTargetsEnclosure(value: Enclosure) {
    if (value === this.methodInstructionArgsEnclosure) {
      throw new Error(
        'Invalid value for property "methodInstructionTargetsEnclosure". ' +
          'It must be different from the value of "methodInstructionArgsEnclosure" property. ' +
          `Received value was "${value}"`
      );
    }

    this._methodInstructionTargetsEnclosure = value;
  }

  /**
   * The instruction writer provider used to create instruction writer instances.
   */
  instructionWriterProvider: InstructionWriterProvider;

  /**
   * The map from a method instruction alias to a method instruction identifier
   * used while parsing method instructions. Whenever the parser reads a method
   * instruction, it determines its identifier from its alias using this map.
   */
  methodInstructionAlias2IdentifierMap = Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP;

  private _instructionsSeparator = Parser.DEFAULT_INSTRUCTIONS_SEPARATOR;
  private _methodInstructionArgsEnclosure = Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_ENCLOSURE;
  private _methodInstructionArgsSeparator = Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR;
  private _methodInstructionTargetsEnclosure = Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_ENCLOSURE;

  /**
   * Creates a parser instance that reads instructions separated by whitespace characters.
   * It can parse two instruction types:
   *  - Method instructions: these instructions are composed of up to 3 parts: an alias,
   *    arguments, and targets. The alias part must be the first part of a method instruction
   *    followed by its arguments and its targets, in any order.
   *    - The method alias (required): It is a text composed of letters in the range [a-zA-Z]
   *      used to identify the method. The parser uses the `methodInstructionAlias2IdentifierMap`
   *      map to determine the method identifier from its alias.
   *    - The method arguments (optional): It is a set of values separated by the
   *      `methodInstructionArgsSeparator` character. This set of values must be enclosed by the
   *      enclosure characters of the type specified by the `methodInstructionArgsEnclosure`.
   *    - The method targets (optional): It is a set of instructions that will be parsed with the
   *      method instruction. This set must be enclosed by the enclosure characters of the type
   *      specified by the `methodInstructionTargetsEnclosure`.
   *  - Basic instructions: Any instruction that does not have a method alias will be considered a
   *    basic instruction. These instructions will be read as is.
   *
   * @param options - The options used to create a parser instance.
   */
  constructor(options: ParserOptions = {}) {
    const {
      instructionWriterProvider,
      methodInstructionAlias2IdentifierMap,
      methodInstructionArgsSeparator,
      methodInstructionArgsEnclosure,
      methodInstructionTargetsEnclosure,
    } = options;

    if (methodInstructionAlias2IdentifierMap !== undefined)
      this.methodInstructionAlias2IdentifierMap = methodInstructionAlias2IdentifierMap;

    if (methodInstructionArgsSeparator !== undefined)
      this.methodInstructionArgsSeparator = methodInstructionArgsSeparator;

    if (methodInstructionArgsEnclosure !== undefined)
      this.methodInstructionArgsEnclosure = methodInstructionArgsEnclosure;

    if (methodInstructionTargetsEnclosure !== undefined)
      this.methodInstructionTargetsEnclosure = methodInstructionTargetsEnclosure;

    if (instructionWriterProvider) this.instructionWriterProvider = instructionWriterProvider;
    else this.instructionWriterProvider = new InternalInstructionWriterFactory();
  }

  /**
   * Parses all possible instructions from an instructions text input.
   * @param instructions - The instructions text input.
   * @param startIndexReference - The index reference used to determine
   * the initial and final read indexes for each parsed instruction.
   * @returns The parsed instructions.
   */
  parseAll(instructions: string, startIndexReference = 0): ParsedInstruction[] {
    const parsedInstructions: ParsedInstruction[] = [];

    let startIndex = 0;
    let parsedInstruction: ParsedInstruction | null = null;
    do {
      parsedInstruction = this._parseNextInstruction(instructions, startIndex, startIndexReference);

      if (parsedInstruction !== null) {
        parsedInstructions.push(parsedInstruction);
        startIndex = parsedInstruction.readToIndex + 1 - startIndexReference;
      }
    } while (parsedInstruction !== null);

    return parsedInstructions;
  }

  /**
   * Parses all possible instructions from an instructions text input, asynchronously.
   * @param instructions - The instructions text input.
   * @param startIndexReference - The index reference used to determine the initial
   * and final read indexes for each parsed instruction.
   * @returns The parsed instructions, once resolved.
   *
   * @see {@link Parser.parseAll}
   */
  async parseAllAsync(
    instrucions: string,
    startIndexReference?: number
  ): Promise<ParsedInstruction[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parseAll(instrucions, startIndexReference));
      } catch (ex) {
        reject(ex);
      }
    });
  }

  /**
   * Parses one instruction from an instruction text input.
   * @param instruction - The instruction text input.
   * @param startIndexReference - The index reference used to determine the
   * initial and final read indexes for the parsed instruction.
   * @returns The parsed instruction.
   */
  parseOne(instruction: string, startIndexReference = 0): ParsedInstruction | null {
    return this._parseNextInstruction(instruction, 0, startIndexReference);
  }

  /**
   * Parses one instruction from an instruction text input, asynchronously.
   * @param instruction - The instruction text input.
   * @param startIndexReference - The index reference used to determine the
   * initial and final read indexes for the parsed instruction.
   * @returns The parsed instruction, once resolved.
   *
   * @see {@link Parser.parseOne}
   */
  async parseOneAsync(
    instruction: string,
    startIndexReference?: number
  ): Promise<ParsedInstruction | null> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parseOne(instruction, startIndexReference));
      } catch (ex) {
        reject(ex);
      }
    });
  }

  private _correctEndForOpeningEnclosureAfter(
    instructions: string,
    instructionStartIndex: number,
    instructionEndIndexCandidate: number
  ): number {
    if (instructionEndIndexCandidate + 1 > instructions.length - 1)
      return instructionEndIndexCandidate;

    const nextInstrStartIndex = StringHelper.getIndexOfDifferent(
      instructions,
      this._instructionsSeparator,
      instructionEndIndexCandidate + 1
    );
    const nextInstrStartChar = instructions[nextInstrStartIndex];
    if (!EnclosuresHelper.isOpeningEnclosure(nextInstrStartChar))
      return instructionEndIndexCandidate;

    const closingBracketIndex = EnclosuresHelper.getIndexOfMatchingClosingEnclosure(
      instructions,
      nextInstrStartIndex
    );

    if (closingBracketIndex < 0) return instructions.length - 1;

    return this._correctEndForOpeningEnclosureAfter(
      instructions,
      instructionStartIndex,
      closingBracketIndex
    );
  }

  private _correctEndForOpeningEnclosureBefore(
    instructions: string,
    instructionStartIndex: number,
    instructionEndIndexCandidate: number
  ): number {
    const openingBracketsIndexes = EnclosuresHelper.openingEnclosures
      .map((openingBracket) => instructions.indexOf(openingBracket, instructionStartIndex))
      .filter((openingBracketIndex) => openingBracketIndex > 0);
    if (openingBracketsIndexes.length === 0) return instructionEndIndexCandidate;

    const firstOpeningBracketIndex = Math.min(...openingBracketsIndexes);
    if (firstOpeningBracketIndex > instructionEndIndexCandidate)
      return instructionEndIndexCandidate;

    const closingBracketIndex = EnclosuresHelper.getIndexOfMatchingClosingEnclosure(
      instructions,
      firstOpeningBracketIndex
    );

    if (closingBracketIndex < 0) return instructions.length - 1;

    return closingBracketIndex;
  }

  private _getIndexOfInstructionEnd(instructions: string, instructionStartIndex: number): number {
    const nextSeparatorIndex = instructions.indexOf(
      this._instructionsSeparator,
      instructionStartIndex
    );
    if (nextSeparatorIndex < 0) return instructions.length - 1;

    let endOfInstructionIndex = this._correctEndForOpeningEnclosureBefore(
      instructions,
      instructionStartIndex,
      nextSeparatorIndex - 1
    );

    endOfInstructionIndex = this._correctEndForOpeningEnclosureAfter(
      instructions,
      instructionStartIndex,
      endOfInstructionIndex
    );

    return endOfInstructionIndex;
  }

  private _getMethodInstruction(
    instruction: string,
    instructionStartIndex: number
  ): ParsedMethodInstruction | null {
    let result = null;

    const methodAlias = ParsedMethodInstruction.extractMethodAlias(instruction);
    if (methodAlias) {
      const methodArguments = ParsedMethodInstruction.extractMethodArguments(
        instruction,
        this.methodInstructionArgsEnclosure,
        this.methodInstructionArgsSeparator
      );

      const methodTargetData = ParsedMethodInstruction.extractMethodTarget(
        instruction,
        this.methodInstructionTargetsEnclosure
      );

      let methodTargets: ParsedInstruction[] = [];
      if (methodTargetData) {
        methodTargets = this.parseAll(
          methodTargetData.target,
          instructionStartIndex + methodTargetData.readFromIndex
        );
      }

      result = new ParsedMethodInstruction({
        alias: methodAlias,
        args: methodArguments,
        identifier: this.methodInstructionAlias2IdentifierMap[methodAlias],
        targets: methodTargets,
      });
    }

    return result;
  }

  private _parseNextInstruction(
    instructions: string,
    fromIndex: number,
    fromIndexReference: number
  ): ParsedInstruction | null {
    if (fromIndex > instructions.length - 1) return null;

    const instructionStartIndex = StringHelper.getIndexOfDifferent(
      instructions,
      this._instructionsSeparator,
      fromIndex
    );
    if (instructionStartIndex < 0) return null;

    const instructionEndIndex = this._getIndexOfInstructionEnd(instructions, instructionStartIndex);

    const instruction = instructions.slice(instructionStartIndex, instructionEndIndex + 1).trim();

    const instructionGlobalStartIndex = instructionStartIndex + fromIndexReference;
    const instructionGlobalEndIndex = instructionEndIndex + fromIndexReference;

    const method = this._getMethodInstruction(instruction, instructionGlobalStartIndex);

    return new ParsedInstruction({
      instructionWriterProvider: this.instructionWriterProvider,
      method,
      readFromIndex: instructionGlobalStartIndex,
      readToIndex: instructionGlobalEndIndex,
      value: instruction,
    });
  }
}
