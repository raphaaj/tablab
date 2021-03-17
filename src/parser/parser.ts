import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { StringHelper } from '../helpers/string-helper';
import { MethodInstructionIdentifier } from '../instruction/enums/method-instruction-identifier';
import { ParsedInstruction, ParsedInstructionData } from './parsed-instruction';
import { ParsedMethodInstruction } from './parsed-method-instruction';

export interface ParserOptions {
  instructionsSeparator?: string;
  methodInstructionAlias2IdentifierMap?: Record<string, string>;
  methodInstructionArgsOpeningEnclosure?: string;
  methodInstructionArgsSeparator?: string;
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

  methodInstructionAlias2IdentifierMap = Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP;
  private _instructionsSeparator = Parser.DEFAULT_INSTRUCTIONS_SEPARATOR;
  private _methodInstructionArgsOpeningEnclosure =
    Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE;
  private _methodInstructionArgsSeparator = Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR;
  private _methodInstructionTargetsOpeningEnclosure =
    Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE;

  constructor({
    instructionsSeparator,
    methodInstructionAlias2IdentifierMap,
    methodInstructionArgsSeparator,
    methodInstructionArgsOpeningEnclosure,
    methodInstructionTargetsOpeningEnclosure,
  }: ParserOptions = {}) {
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

  parseOne(instruction: string, startIndexReference = 0): ParsedInstructionData | null {
    return this._parseNextInstruction(instruction, 0, startIndexReference);
  }

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
