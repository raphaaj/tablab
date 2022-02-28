import { Parser } from '../../src/parser/parser';
import {
  ParsedInstruction,
  ParsedInstructionResult,
} from '../../src/parser/parsed-instruction-result';
import { ParsedMethodInstructionResult } from '../../src/parser/parsed-method-instruction-result';
import { Enclosure } from '../../src/helpers/enclosures-helper';
import { Instruction } from '../../src/instruction/instructions/instruction';
import { InstructionProvider } from '../../src/instruction/factories/instruction-factory-base';
import { InstructionFactory } from '../../src/instruction/factories/instruction-factory';

const GLOBAL_INDEX_REFERENCE = 5;

class NullInstructionProvider implements InstructionProvider {
  getInstruction(): Instruction {
    throw new Error('Method not implemented');
  }
}

let parser: Parser;
beforeEach(() => {
  parser = new Parser({ instructionProvider: new NullInstructionProvider() });
});

describe(`[${Parser.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a parser with the default parameters if no configuration is given', () => {
      const parser = new Parser();

      expect(parser.methodInstructionAlias2IdentifierMap).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP
      );
      expect(parser.methodInstructionArgsSeparator).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR
      );
      expect(parser.methodInstructionArgsEnclosure).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_ENCLOSURE
      );
      expect(parser.methodInstructionTargetsEnclosure).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_ENCLOSURE
      );
      expect(parser.instructionProvider).toBeInstanceOf(InstructionFactory);
    });

    it('should set the instructionProvider if one is set at instantiation', () => {
      const instructionProvider = new NullInstructionProvider();
      const parser = new Parser({ instructionProvider });

      expect(parser.instructionProvider).toBe(instructionProvider);
    });

    it('should set the methodInstructionAlias2IdentifierMap if one is set at instantiation', () => {
      const alias2IdentifierMap: Record<string, string> = {};
      const parser = new Parser({ methodInstructionAlias2IdentifierMap: alias2IdentifierMap });

      expect(parser.methodInstructionAlias2IdentifierMap).toBe(alias2IdentifierMap);
    });

    it('should set the methodInstructionArgsSeparator if one is set at instantiation', () => {
      const methodInstructionArgsSeparator = '|';
      const parser = new Parser({ methodInstructionArgsSeparator });

      expect(parser.methodInstructionArgsSeparator).toBe(methodInstructionArgsSeparator);
    });

    it('should set the methodInstructionArgsEnclosure if one is set at instantiation', () => {
      const methodInstructionArgsEnclosure = Enclosure.AngleBrackets;

      const parser = new Parser({ methodInstructionArgsEnclosure });

      expect(parser.methodInstructionArgsEnclosure).toBe(methodInstructionArgsEnclosure);
    });

    it('should set the methodInstructionTargetsEnclosure if one is set at instantiation', () => {
      const methodInstructionTargetsEnclosure = Enclosure.SquareBrackets;

      const parser = new Parser({ methodInstructionTargetsEnclosure });

      expect(parser.methodInstructionTargetsEnclosure).toBe(methodInstructionTargetsEnclosure);
    });
  });

  describe('[properties]', () => {
    describe('[methodInstructionArgsSeparator]', () => {
      it('should set the methodInstructionArgsSeparator property', () => {
        const methodInstructionArgsSeparator = '|';

        parser.methodInstructionArgsSeparator = methodInstructionArgsSeparator;

        expect(parser.methodInstructionArgsSeparator).toBe(methodInstructionArgsSeparator);
      });

      it('should throw if the methodInstructionArgsSeparator is set to a non single character string', () => {
        const methodInstructionArgsSeparator = '||';

        expect(
          () => (parser.methodInstructionArgsSeparator = methodInstructionArgsSeparator)
        ).toThrow();
      });
    });

    describe('[methodInstructionArgsEnclosure]', () => {
      it('should set the methodInstructionArgsEnclosure property', () => {
        const methodInstructionArgsEnclosure = Enclosure.AngleBrackets;

        parser.methodInstructionArgsEnclosure = methodInstructionArgsEnclosure;

        expect(parser.methodInstructionArgsEnclosure).toBe(methodInstructionArgsEnclosure);
      });

      it(
        'should throw if the methodInstructionArgsEnclosure property is set to the ' +
          'same value of the methodInstructionTargetsEnclosure property',
        () => {
          expect(
            () => (parser.methodInstructionArgsEnclosure = parser.methodInstructionTargetsEnclosure)
          ).toThrow();
        }
      );
    });

    describe('[methodInstructionTargetsEnclosure]', () => {
      it('should set the methodInstructionTargetsEnclosure property', () => {
        const methodInstructionTargetsEnclosure = Enclosure.SquareBrackets;

        parser.methodInstructionTargetsEnclosure = methodInstructionTargetsEnclosure;

        expect(parser.methodInstructionTargetsEnclosure).toBe(methodInstructionTargetsEnclosure);
      });

      it(
        'should throw if methodInstructionTargetsEnclosure property is set to the ' +
          'same value of the methodInstructionArgsEnclosure property',
        () => {
          expect(
            () => (parser.methodInstructionTargetsEnclosure = parser.methodInstructionArgsEnclosure)
          ).toThrow();
        }
      );
    });
  });

  describe('[parse single instruction]', () => {
    const nonMethodInstruction = '1-0';

    const getExpectedParsedNonMethodInstruction = (): ParsedInstruction => {
      return new ParsedInstructionResult({
        method: null,
        value: nonMethodInstruction,
        readFromIndex: 0,
        readToIndex: nonMethodInstruction.length - 1,
        instructionProvider: new NullInstructionProvider(),
      });
    };

    describe('[parseOne]', () => {
      it('should parse no instructions if the given instruction string is empty, returning null', () => {
        const instruction = '     ';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction).toBeNull();
      });

      it('should parse one instruction with the default index reference if none is provided', () => {
        const expectedParsedInstruction = getExpectedParsedNonMethodInstruction();

        const parsedInstruction = parser.parseOne(nonMethodInstruction);

        expect(parsedInstruction).toEqual(expectedParsedInstruction);
      });

      it('should parse one instruction with the given index reference when provided', () => {
        const expectedParsedInstruction = getExpectedParsedNonMethodInstruction();

        expectedParsedInstruction.readFromIndex += GLOBAL_INDEX_REFERENCE;
        expectedParsedInstruction.readToIndex += GLOBAL_INDEX_REFERENCE;

        const parsedInstruction = parser.parseOne(nonMethodInstruction, GLOBAL_INDEX_REFERENCE);

        expect(parsedInstruction).toEqual(expectedParsedInstruction);
      });

      it('should parse a method instruction with enclosures as a single instruction', () => {
        const instruction = 'instr(arg1, arg2)[arg1, arg2]{arg1, arg2}<arg1, arg3>';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.value).toBe(instruction);
      });

      it('should parse a method instruction with enclosures as a single instruction, even with spaces between', () => {
        const instruction =
          '  instr  (  arg1  ,  arg2  )  [  arg1  ,  arg2  ]  {  arg1  ,  arg2  }  <  arg1  ,  arg2  >  ';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.value).toBe(instruction.trim());
      });

      it('should parse a method instruction with no matching closing enclosure to the end of the instruction string', () => {
        const instruction = 'instr(arg1, arg2[arg1, arg2]{arg1, arg2}<arg1, arg2>';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.value).toBe(instruction);
      });

      it('should parse a method instruction with no matching closing enclosure to the end of the instruction string, even with spaces between', () => {
        const instruction = '  instr  (  arg1  ,  arg2  )  [  arg1  ,  arg2  ]  {  arg1  ,  arg2  ';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.value).toBe(instruction.trim());
      });

      it('should parse the alias of a method instruction and set the method identifier when found', () => {
        const alias = 'doSomethingElse';
        const instruction = ` ${alias} `;
        const aliasIdentifier = 'doThis';

        const parser = new Parser({
          methodInstructionAlias2IdentifierMap: { [alias]: aliasIdentifier },
        });

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.alias).toBe(alias);
        expect(parsedInstruction?.method?.identifier).toBe(aliasIdentifier);
      });

      it('should parse the alias of a method instruction and set the method identifier to null if not found', () => {
        const alias = 'doSomethingElse';
        const instruction = ` ${alias} `;

        const parser = new Parser({
          methodInstructionAlias2IdentifierMap: {},
        });

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.alias).toBe(alias);
        expect(parsedInstruction?.method?.identifier).toBe(null);
      });

      it('should parse the arguments of a method instruction when available', () => {
        const methodInstructionArgsSeparator = '|';
        const methodInstructionArgsEnclosure = Enclosure.AngleBrackets;
        const args = ['1', '1.11', 'some text argument'];
        const instruction = `instr<${args.join(methodInstructionArgsSeparator)}>`;

        const parser = new Parser({
          methodInstructionArgsSeparator,
          methodInstructionArgsEnclosure,
        });

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.args).toEqual(args);
      });

      it('should parse the arguments of a method instruction when available, even with spaces', () => {
        const methodInstructionArgsSeparator = '|';
        const methodInstructionArgsEnclosure = Enclosure.AngleBrackets;
        const args = ['1', '1.11', 'some text input'];
        const instruction = `  instr  <  ${args.join(
          `  ${methodInstructionArgsSeparator}  `
        )}  >  `;

        const parser = new Parser({
          methodInstructionArgsSeparator,
          methodInstructionArgsEnclosure,
        });

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.args).toEqual(args);
      });

      it('should parse the arguments of a method instruction as an empty array when not available', () => {
        const args: string[] = [];
        const instruction = 'instr';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.args).toEqual(args);
      });

      it('should parse the targets of a method instruction when available', () => {
        const methodInstructionTargetsEnclosure = Enclosure.SquareBrackets;

        const targets = ['1-2', '2-3'];
        const instruction = `instr[${targets.join(' ')}]`;
        const parser = new Parser({ methodInstructionTargetsEnclosure });

        const parsedInstruction = parser.parseOne(instruction);
        const parsedTargets = parsedInstruction?.method?.targets?.map((target) => target.value);

        expect(parsedTargets).toEqual(targets);
      });

      it('should parse the targets of a method instruction when available, even with spaces', () => {
        const methodInstructionTargetsEnclosure = Enclosure.SquareBrackets;

        const targets = ['1-2', '2-3'];
        const instruction = `  instr  [  ${targets.join('  ')}  ]  `;
        const parser = new Parser({ methodInstructionTargetsEnclosure });

        const parsedInstruction = parser.parseOne(instruction);
        const parsedTargets = parsedInstruction?.method?.targets?.map((target) => target.value);

        expect(parsedTargets).toEqual(targets);
      });

      it('should parse the targets of a method instruction as an empty array when not available', () => {
        const targets: ParsedInstruction[] = [];
        const instruction = 'instr';

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.targets).toEqual(targets);
      });

      it('should keep the method instruction targets positions at the global reference', () => {
        const innerTargets = ['6-1', '6-2'];
        const target = `instr{${innerTargets.join(' ')}}`;
        const instruction = `instr{${target}}`;

        const parsedInstruction = parser.parseOne(instruction);
        const parsedTargets = parsedInstruction?.method?.targets;
        const parsedInnerTargets = parsedTargets ? parsedTargets[0]?.method?.targets : null;

        expect(parsedInnerTargets).not.toBeNull();
        expect(parsedInnerTargets).toBeDefined();
        if (parsedInnerTargets) {
          innerTargets.forEach((target, idx) => {
            expect(parsedInnerTargets[idx].value).toBe(target);
            expect(parsedInnerTargets[idx].readFromIndex).toBe(instruction.indexOf(target));
            expect(parsedInnerTargets[idx].readToIndex).toBe(
              instruction.indexOf(target) + target.length - 1
            );
          });
        }
      });

      it('should keep the method instruction targets positions at the global reference, even with spaces', () => {
        const innerTargets = ['6-1', '6-2'];
        const target = `  instr  {  ${innerTargets.join('  ')}  }  `;
        const instruction = `  instr  {  ${target}  }  `;

        const parsedInstruction = parser.parseOne(instruction);
        const parsedTargets = parsedInstruction?.method?.targets;
        const parsedInnerTargets = parsedTargets ? parsedTargets[0]?.method?.targets : null;

        expect(parsedInnerTargets).not.toBeNull();
        expect(parsedInnerTargets).toBeDefined();
        if (parsedInnerTargets) {
          innerTargets.forEach((target, idx) => {
            expect(parsedInnerTargets[idx].value).toBe(target);
            expect(parsedInnerTargets[idx].readFromIndex).toBe(instruction.indexOf(target));
            expect(parsedInnerTargets[idx].readToIndex).toBe(
              instruction.indexOf(target) + target.length - 1
            );
          });
        }
      });
    });

    describe('[parseOneAsync]', () => {
      it('should parse one instrunction asynchronously with the default index reference if none is provided', async () => {
        const instructions = '   ';

        parser.parseOne = jest.fn();
        await parser.parseOneAsync(instructions);

        expect(parser.parseOne).toHaveBeenCalledWith(instructions, undefined);
      });

      it('should parse one instrunction asynchronously with the given index reference when provided', async () => {
        const instructions = '   ';

        parser.parseOne = jest.fn();
        await parser.parseOneAsync(instructions, GLOBAL_INDEX_REFERENCE);

        expect(parser.parseOne).toHaveBeenCalledWith(instructions, GLOBAL_INDEX_REFERENCE);
      });

      it('should reject if an error occurs while parsing the instruction', async () => {
        const parseError = new Error();

        parser.parseOne = jest.fn(() => {
          throw parseError;
        });

        await expect(parser.parseOneAsync('')).rejects.toBe(parseError);
      });
    });
  });

  describe('[parse multiple instructions]', () => {
    const instruction1 = '1-0';
    const instruction2 = 'methodInstruction(arg1, arg2)';
    const instructions = ` ${instruction1} ${instruction2} `;

    const getExpectedParsedInstruction1 = (): ParsedInstruction => {
      const instruction1StartIndexAtInstructions = instructions.indexOf(instruction1);

      return new ParsedInstructionResult({
        method: null,
        value: instruction1,
        readFromIndex: instruction1StartIndexAtInstructions,
        readToIndex: instruction1StartIndexAtInstructions + instruction1.length - 1,
        instructionProvider: new NullInstructionProvider(),
      });
    };

    const getExpectedParsedInstruction2 = (): ParsedInstruction => {
      const instruction2StartIndexAtInstructions = instructions.indexOf(instruction2);

      return new ParsedInstructionResult({
        method: new ParsedMethodInstructionResult({
          alias: 'methodInstruction',
          args: ['arg1', 'arg2'],
          identifier: null,
          targets: [],
        }),
        value: instruction2,
        readFromIndex: instruction2StartIndexAtInstructions,
        readToIndex: instruction2StartIndexAtInstructions + instruction2.length - 1,
        instructionProvider: new NullInstructionProvider(),
      });
    };

    describe(`[parseAll]`, () => {
      it('should parse all instructions from the given instructions string with the default index reference if none is provided', () => {
        const expectedParsedInstruction1 = getExpectedParsedInstruction1();
        const expectedParsedInstruction2 = getExpectedParsedInstruction2();

        const parsedInstructions = parser.parseAll(instructions);

        expect(parsedInstructions.length).toBe(2);
        expect(parsedInstructions[0]).toEqual(expectedParsedInstruction1);
        expect(parsedInstructions[1]).toEqual(expectedParsedInstruction2);
      });

      it('should parse all instructions from the given instructions string with the given index reference when provided', () => {
        const expectedParsedInstruction1 = getExpectedParsedInstruction1();
        const expectedParsedInstruction2 = getExpectedParsedInstruction2();

        expectedParsedInstruction1.readFromIndex += GLOBAL_INDEX_REFERENCE;
        expectedParsedInstruction1.readToIndex += GLOBAL_INDEX_REFERENCE;
        expectedParsedInstruction2.readFromIndex += GLOBAL_INDEX_REFERENCE;
        expectedParsedInstruction2.readToIndex += GLOBAL_INDEX_REFERENCE;

        const parsedInstructions = parser.parseAll(instructions, GLOBAL_INDEX_REFERENCE);

        expect(parsedInstructions.length).toBe(2);

        expect(parsedInstructions[0]).toEqual(expectedParsedInstruction1);
        expect(parsedInstructions[1]).toEqual(expectedParsedInstruction2);
      });
    });

    describe('[parseAllAsync]', () => {
      it('should parse all instructions asynchronously with the default index reference if none is provided', async () => {
        parser.parseAll = jest.fn();
        await parser.parseAllAsync(instructions);

        expect(parser.parseAll).toHaveBeenCalledWith(instructions, undefined);
      });

      it('should parse all instructions asynchronously with the given index reference when provided', async () => {
        parser.parseAll = jest.fn();
        await parser.parseAllAsync(instructions, GLOBAL_INDEX_REFERENCE);

        expect(parser.parseAll).toHaveBeenCalledWith(instructions, GLOBAL_INDEX_REFERENCE);
      });

      it('should reject if an error occurs while parsing the instructions', async () => {
        const parseError = new Error();

        parser.parseAll = jest.fn(() => {
          throw parseError;
        });

        await expect(parser.parseAllAsync('')).rejects.toBe(parseError);
      });
    });
  });
});
