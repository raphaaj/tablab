import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { StringHelper } from '../helpers/string-helper';
import { InstructionMethodIdentifier } from '../instruction/enums/instruction-method-identifier';
import { MethodResult } from './method-result';
import { ParserResult } from './parser-result';

export interface ParserConfig {
  instructionsSeparator?: string;
  methodInstructionAlias2IdentifierMap?: Record<string, string>;
  methodInstructionArgsOpeningEnclosure?: string;
  methodInstructionArgsSeparator?: string;
  methodInstructionTargetsOpeningEnclosure?: string;
}

export class Parser {
  static readonly DEFAULT_INSTRUCTIONS_SEPARATOR = ' ';
  static readonly DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP: Record<string, string> = {
    break: InstructionMethodIdentifier.Break,
    footer: InstructionMethodIdentifier.WriteFooter,
    header: InstructionMethodIdentifier.WriteHeader,
    merge: InstructionMethodIdentifier.Merge,
    repeat: InstructionMethodIdentifier.Repeat,
    spacing: InstructionMethodIdentifier.SetSpacing,
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
  }: ParserConfig = {}) {
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

  parseAll(instructions: string, startIndexReference = 0): ParserResult[] {
    const results: ParserResult[] = [];

    let startIndex = 0;
    let result = null;
    do {
      result = this._parseNextInstruction(instructions, startIndex, startIndexReference);

      if (result !== null) {
        results.push(result);
        startIndex = result.readToIndex + 1 - startIndexReference;
      }
    } while (result !== null);

    return results;
  }

  async parseAllAsync(instrucions: string): Promise<ParserResult[]> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parseAll(instrucions));
      } catch (ex) {
        reject(ex);
      }
    });
  }

  parseOne(instruction: string, startIndexReference = 0): ParserResult | null {
    return this._parseNextInstruction(instruction, 0, startIndexReference);
  }

  async parseOneAsync(instruction: string): Promise<ParserResult | null> {
    return new Promise((resolve, reject) => {
      try {
        resolve(this.parseOne(instruction));
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

    const closingBracketIndex = StringHelper.getIndexOfMatchingClosingEnclosure(
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

    const closingBracketIndex = StringHelper.getIndexOfMatchingClosingEnclosure(
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

  private _getMethodResult(
    parsedInstruction: string,
    parsedInstructionStartIndex: number
  ): MethodResult | null {
    let result = null;

    const methodAlias = MethodResult.extractMethodAlias(parsedInstruction);
    if (methodAlias) {
      const methodArguments = MethodResult.extractMethodArguments(
        parsedInstruction,
        this.methodInstructionArgsOpeningEnclosure,
        this.methodInstructionArgsSeparator
      );

      const methodTargetExtractionResult = MethodResult.extractMethodTarget(
        parsedInstruction,
        this.methodInstructionTargetsOpeningEnclosure
      );

      let methodTargets: ParserResult[] = [];
      if (methodTargetExtractionResult) {
        methodTargets = this.parseAll(
          methodTargetExtractionResult.target,
          parsedInstructionStartIndex + methodTargetExtractionResult.indexAtInstruction
        );
      }

      result = new MethodResult({
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
  ): ParserResult | null {
    if (fromIndex > instructions.length - 1) return null;

    const instructionStartIndex = StringHelper.getIndexOfDifferent(
      instructions,
      this.instructionsSeparator,
      fromIndex
    );
    if (instructionStartIndex < 0) return null;

    const instructionEndIndex = this._getIndexOfInstructionEnd(instructions, instructionStartIndex);

    const parsedInstruction = instructions
      .slice(instructionStartIndex, instructionEndIndex + 1)
      .trim();

    const instructionGlobalStartIndex = instructionStartIndex + fromIndexReference;
    const instructionGlobalEndIndex = instructionEndIndex + fromIndexReference;

    const methodResult = this._getMethodResult(parsedInstruction, instructionGlobalStartIndex);

    return new ParserResult({
      value: parsedInstruction,
      readFromIndex: instructionGlobalStartIndex,
      readToIndex: instructionGlobalEndIndex,
      methodResult,
    });
  }
}
