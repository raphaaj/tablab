import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { StringHelper } from '../helpers/string-helper';
import { MethodInstructionIdentifier } from '../instruction/enums/method-instruction-identifier';
import { ParsedInstruction, ParsedInstructionData } from './parsed-instruction';
import { ParsedMethodInstruction } from './parsed-method-instruction';

/**
 * The options to create a parser.
 */
export interface ParserOptions {
  /**
   * The character to be considered as the separator of instructions.
   * It must be a string with a single character.
   * @defaultValue {@link Parser.DEFAULT_INSTRUCTIONS_SEPARATOR}
   */
  instructionsSeparator?: string;

  /**
   * The map from a method alias to a method identifier to be used while parsing
   * method instructions. Whenever a method instruction is parsed the method
   * identifier will be determined from its method alias using this map.
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP}
   */
  methodInstructionAlias2IdentifierMap?: Record<string, string>;

  /**
   * The opening bracket character to be considered for identification of the
   * method arguments while parsing method instructions. The data from the
   * opening bracket to the matching closing bracket will be considered the
   * arguments of the method instruction.
   * It must be one of: `{`, `[`, `<` or `(`.
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE}
   */
  methodInstructionArgsOpeningEnclosure?: string;

  /**
   * The character to be considered as the separator of the arguments of a
   * method instruction.
   * It must be a string with a single character.
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR}
   */
  methodInstructionArgsSeparator?: string;

  /**
   * The opening bracket character to be considered for identification of the
   * method targets while parsing method instructions. The data from the
   * opening bracket to the matching closing bracket will be considered the
   * targets of the method instruction.
   * It must be one of: `{`, `[`, `<` or `(`.
   * @defaultValue {@link Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE}
   */
  methodInstructionTargetsOpeningEnclosure?: string;
}

export class Parser {
  static readonly DEFAULT_INSTRUCTIONS_SEPARATOR = ' ';
  static readonly DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP: Record<string, string> = {
    break: MethodInstructionIdentifier.Break,
    footer: MethodInstructionIdentifier.WriteFooter,
    header: MethodInstructionIdentifier.WriteHeader,
    merge: MethodInstructionIdentifier.Merge,
    repeat: MethodInstructionIdentifier.Repeat,
    spacing: MethodInstructionIdentifier.SetSpacing,
  };
  static readonly DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE = '(';
  static readonly DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR = ',';
  static readonly DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE = '{';

  /**
   * The character used to separate instructions. It must be a single character string.
   */
  get instructionsSeparator(): string {
    return this._instructionsSeparator;
  }
  set instructionsSeparator(value: string) {
    if (value.length !== 1)
      throw new Error(
        'The parameter instructionsSeparator must be a single character string. ' +
          `Received value was ${value}`
      );

    this._instructionsSeparator = value;
  }

  /**
   * The opening bracket character used to identify the method arguments while parsing
   * method instructions. The data inside the brackets pair, from the opening bracket
   * character to the matching closing bracket character, will be considered the
   * arguments of the method instruction. It must be one of: `{`, `[`, `<` or `(`.
   */
  get methodInstructionArgsOpeningEnclosure(): string {
    return this._methodInstructionArgsOpeningEnclosure;
  }
  set methodInstructionArgsOpeningEnclosure(value: string) {
    if (!EnclosuresHelper.isOpeningEnclosure(value))
      throw new Error(
        'The parameter methodInstructionArgsOpeningEnclosure must be one of ' +
          `"${EnclosuresHelper.openingEnclosures.join('", "')}". Received value was "${value}".`
      );

    this._methodInstructionArgsOpeningEnclosure = value;
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
        'The parameter methodInstructionArgsSeparator must be a single character string. ' +
          `Received value was ${value}`
      );
    this._methodInstructionArgsSeparator = value;
  }

  /**
   * The opening bracket character used to identify the method targets while parsing
   * method instructions. The data inside the brackets pair, from the opening bracket
   * character to the matching closing bracket character, will be considered the targets
   * of the method instruction. It must be one of: `{`, `[`, `<` or `(`.
   */
  get methodInstructionTargetsOpeningEnclosure(): string {
    return this._methodInstructionTargetsOpeningEnclosure;
  }
  set methodInstructionTargetsOpeningEnclosure(value: string) {
    if (!EnclosuresHelper.isOpeningEnclosure(value))
      throw new Error(
        'The parameter methodInstructionTargetsOpeningEnclosure must be one of ' +
          `"${EnclosuresHelper.openingEnclosures.join('", "')}". Received value was "${value}".`
      );

    this._methodInstructionTargetsOpeningEnclosure = value;
  }

  /**
   * The map from a method alias to a method identifier used while parsing method instructions.
   * Whenever the parser reads a method instruction, it determines its identifier from its alias
   * using this map.
   */
  methodInstructionAlias2IdentifierMap = Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP;

  private _instructionsSeparator = Parser.DEFAULT_INSTRUCTIONS_SEPARATOR;
  private _methodInstructionArgsOpeningEnclosure =
    Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE;
  private _methodInstructionArgsSeparator = Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR;
  private _methodInstructionTargetsOpeningEnclosure =
    Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE;

  /**
   * The parser constructor creates a parser that reads instructions separated by one or
   * more `instructionsSeparator` characters. It can parse two instruction types:
   *  - Method instructions: these instructions are composed of up to 3 parts: an alias,
   *    arguments, and targets. The alias part must be the first part of a method instruction
   *    followed by its arguments and its targets, in any order.
   *    - The method alias (required): It is a text composed of letters in the range [a-zA-Z]
   *      used to identify the method. The parser uses the `methodInstructionAlias2IdentifierMap`
   *      map to determine the method identifier from its alias.
   *    - The method arguments (optional): It is a set of values separated by the
   *      `methodInstructionArgsSeparator` character. This set must follow the opening bracket
   *      `methodInstructionArgsOpeningEnclosure` character and should be followed by the matching
   *      closing bracket character.
   *    - The method targets (optional): It is a set of instructions that will be parsed with the
   *      method instruction. This set must follow the opening bracket
   *      `methodInstructionTargetsOpeningEnclosure` character and should be followed by the matching
   *      closing bracket character.
   *  - Basic instructions: Any instruction that does not have a method alias will be considered a
   *    basic instruction. These instructions will be read as is.
   *
   * @param options - The options used to create a parser.
   */
  constructor(options: ParserOptions = {}) {
    const {
      instructionsSeparator,
      methodInstructionAlias2IdentifierMap,
      methodInstructionArgsSeparator,
      methodInstructionArgsOpeningEnclosure,
      methodInstructionTargetsOpeningEnclosure,
    } = options;

    if (instructionsSeparator !== undefined) this.instructionsSeparator = instructionsSeparator;

    if (methodInstructionAlias2IdentifierMap !== undefined)
      this.methodInstructionAlias2IdentifierMap = methodInstructionAlias2IdentifierMap;

    if (methodInstructionArgsSeparator !== undefined)
      this.methodInstructionArgsSeparator = methodInstructionArgsSeparator;

    if (methodInstructionArgsOpeningEnclosure !== undefined)
      this.methodInstructionArgsOpeningEnclosure = methodInstructionArgsOpeningEnclosure;

    if (methodInstructionTargetsOpeningEnclosure !== undefined)
      this.methodInstructionTargetsOpeningEnclosure = methodInstructionTargetsOpeningEnclosure;
  }

  /**
   * Parses all possible instructions from an instructions text input.
   * @param instructions - The instructions text input.
   * @param startIndexReference - The index reference used to determine
   * the initial and final read indexes for each parsed instruction.
   * @returns The data of the parsed instructions.
   */
  parseAll(instructions: string, startIndexReference = 0): ParsedInstructionData[] {
    const parsedInstructions: ParsedInstruction[] = [];

    let startIndex = 0;
    let parsedInstruction: ParsedInstructionData | null = null;
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
   * @returns The data of the parsed instructions, once resolved.
   *
   * @see {@link Parser.parseAll}
   */
  async parseAllAsync(
    instrucions: string,
    startIndexReference?: number
  ): Promise<ParsedInstructionData[]> {
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
   * @returns The data of the parsed instruction.
   */
  parseOne(instruction: string, startIndexReference = 0): ParsedInstructionData | null {
    return this._parseNextInstruction(instruction, 0, startIndexReference);
  }

  /**
   * Parses one instruction from an instruction text input, asynchronously.
   * @param instruction - The instruction text input.
   * @param startIndexReference - The index reference used to determine the
   * initial and final read indexes for the parsed instruction.
   * @returns The data of the parsed instruction, once resolved.
   *
   * @see {@link Parser.parseOne}
   */
  async parseOneAsync(
    instruction: string,
    startIndexReference?: number
  ): Promise<ParsedInstructionData | null> {
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
      this.instructionsSeparator,
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
      this.instructionsSeparator,
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
        this.methodInstructionArgsOpeningEnclosure,
        this.methodInstructionArgsSeparator
      );

      const methodTargetData = ParsedMethodInstruction.extractMethodTarget(
        instruction,
        this.methodInstructionTargetsOpeningEnclosure
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
      this.instructionsSeparator,
      fromIndex
    );
    if (instructionStartIndex < 0) return null;

    const instructionEndIndex = this._getIndexOfInstructionEnd(instructions, instructionStartIndex);

    const instruction = instructions.slice(instructionStartIndex, instructionEndIndex + 1).trim();

    const instructionGlobalStartIndex = instructionStartIndex + fromIndexReference;
    const instructionGlobalEndIndex = instructionEndIndex + fromIndexReference;

    const method = this._getMethodInstruction(instruction, instructionGlobalStartIndex);

    return new ParsedInstruction({
      value: instruction,
      readFromIndex: instructionGlobalStartIndex,
      readToIndex: instructionGlobalEndIndex,
      method,
    });
  }
}
