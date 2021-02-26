import { EnclosuresHelper } from '../helpers/enclosures-helper';
import { StringHelper } from '../helpers/string-helper';

class MethodInstructionParamsDTO {
  constructor(
    readonly method: string | null,
    readonly args: string | null,
    readonly targets: string | null
  ) {}
}

class MethodInstructionResultDTO {
  constructor(
    readonly method: string | null,
    readonly args: (string | number)[] | null,
    readonly targets: ParserResult[] | null
  ) {}
}

export class ParserResult {
  constructor(
    public value: string,
    public readFromIdx: number,
    public readToIdx: number,
    public method: string | null,
    public args: (string | number)[] | null,
    public targets: ParserResult[] | null
  ) {}
}

export interface ParserConfig {
  instructionsSeparator?: string;
  methodInstructionArgsOpeningEnclosure?: string;
  methodInstructionArgsSeparator?: string;
  methodInstructionTargetsOpeningEnclosure?: string;
}

export class Parser {
  static readonly DEFAULT_INSTRUCTIONS_SEPARATOR = ' ';
  static readonly DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE = '(';
  static readonly DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR = ',';
  static readonly DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE = '{';

  private static readInstructionMethod(parsedInstruction: string): string | null {
    const extractionReg = /^([a-z]+)(?!-)/gim;
    const methodRegexMatchResult = extractionReg.exec(parsedInstruction);

    return methodRegexMatchResult ? methodRegexMatchResult[1] : null;
  }

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

  private _instructionsSeparator = Parser.DEFAULT_INSTRUCTIONS_SEPARATOR;
  private _methodInstructionArgsOpeningEnclosure =
    Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE;
  private _methodInstructionArgsSeparator = Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR;
  private _methodInstructionTargetsOpeningEnclosure =
    Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE;

  constructor({
    instructionsSeparator,
    methodInstructionArgsSeparator,
    methodInstructionArgsOpeningEnclosure,
    methodInstructionTargetsOpeningEnclosure,
  }: ParserConfig = {}) {
    if (instructionsSeparator !== undefined) this.instructionsSeparator = instructionsSeparator;

    if (methodInstructionArgsSeparator !== undefined)
      this.methodInstructionArgsSeparator = methodInstructionArgsSeparator;

    if (methodInstructionArgsOpeningEnclosure !== undefined)
      this.methodInstructionArgsOpeningEnclosure = methodInstructionArgsOpeningEnclosure;

    if (methodInstructionTargetsOpeningEnclosure !== undefined)
      this.methodInstructionTargetsOpeningEnclosure = methodInstructionTargetsOpeningEnclosure;
  }

  parseAll(instructions: string): ParserResult[] {
    const results: ParserResult[] = [];

    let startIndex = 0;
    let result = null;
    do {
      result = this.parseNextInstruction(instructions, startIndex);

      if (result !== null) {
        results.push(result);
        startIndex = result.readToIdx + 1;
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

  parseOne(instruction: string): ParserResult | null {
    return this.parseNextInstruction(instruction, 0);
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

  private correctEndForOpeningEnclosureAfter(
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

    return this.correctEndForOpeningEnclosureAfter(
      instructions,
      instructionStartIndex,
      closingBracketIndex
    );
  }

  private correctEndForOpeningEnclosureBefore(
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

  private indexOfInstructionEnd(instructions: string, instructionStartIndex: number): number {
    const nextSeparatorIndex = instructions.indexOf(
      this.instructionsSeparator,
      instructionStartIndex
    );
    if (nextSeparatorIndex < 0) return instructions.length - 1;

    let endOfInstructionIndex = this.correctEndForOpeningEnclosureBefore(
      instructions,
      instructionStartIndex,
      nextSeparatorIndex - 1
    );

    endOfInstructionIndex = this.correctEndForOpeningEnclosureAfter(
      instructions,
      instructionStartIndex,
      endOfInstructionIndex
    );

    return endOfInstructionIndex;
  }

  private parseNextInstruction(instructions: string, fromIndex: number): ParserResult | null {
    if (fromIndex > instructions.length - 1) return null;

    const instructionStartIndex = StringHelper.getIndexOfDifferent(
      instructions,
      this.instructionsSeparator,
      fromIndex
    );
    if (instructionStartIndex < 0) return null;

    const instructionEndIndex = this.indexOfInstructionEnd(instructions, instructionStartIndex);

    const parsedInstruction = instructions
      .slice(instructionStartIndex, instructionEndIndex + 1)
      .trim();
    const { method, args, targets } = this.readAsMethodInstruction(
      parsedInstruction,
      instructionStartIndex
    );

    return new ParserResult(
      parsedInstruction,
      instructionStartIndex,
      instructionEndIndex,
      method,
      args,
      targets
    );
  }

  private readAsMethodInstruction(
    parsedInstruction: string,
    parsedInstructionStartIdx: number
  ): MethodInstructionResultDTO {
    const { method, args, targets } = this.readMethodInstructionParams(parsedInstruction);

    const readArgs = args ? this.readMethodInstructionArgs(args) : null;

    const readTargets = targets
      ? this.readMethodInstructionTargets(targets, parsedInstruction, parsedInstructionStartIdx)
      : null;

    return new MethodInstructionResultDTO(method, readArgs, readTargets);
  }

  private readMethodInstructionArgs(args: string): (string | number)[] {
    return args.split(this.methodInstructionArgsSeparator).map((arg) => {
      const argNumber = Number(arg);
      return isNaN(argNumber) ? arg.trim() : argNumber;
    });
  }
  private readMethodInstructionParams(parsedInstruction: string): MethodInstructionParamsDTO {
    const method = Parser.readInstructionMethod(parsedInstruction);
    const args = EnclosuresHelper.getValueInsideEnclosure(
      parsedInstruction,
      this.methodInstructionArgsOpeningEnclosure
    );

    const targets = EnclosuresHelper.getValueInsideEnclosure(
      parsedInstruction,
      this.methodInstructionTargetsOpeningEnclosure
    );

    return new MethodInstructionParamsDTO(method, args, targets);
  }

  private readMethodInstructionTargets(
    targets: string,
    parsedInstruction: string,
    parsedInstructionStartIdx: number
  ): ParserResult[] {
    let parsedTargets = this.parseAll(targets);
    parsedTargets = this.updateParsedTargetsIndexesReference(
      parsedTargets,
      parsedInstruction,
      parsedInstructionStartIdx
    );

    return parsedTargets;
  }

  private updateParsedTargetsIndexesReference(
    parsedTargets: ParserResult[],
    parsedInstruction: string,
    parsedInstructionStartIdx: number
  ): ParserResult[] {
    return parsedTargets.map((parsedTarget) => {
      parsedTarget.readFromIdx =
        parsedInstructionStartIdx + parsedInstruction.indexOf(parsedTarget.value);
      parsedTarget.readToIdx = parsedTarget.readFromIdx + parsedTarget.value.length - 1;

      if (parsedTarget.targets) {
        this.updateParsedTargetsIndexesReference(
          parsedTarget.targets,
          parsedTarget.value,
          parsedTarget.readFromIdx
        );
      }

      return parsedTarget;
    });
  }
}
