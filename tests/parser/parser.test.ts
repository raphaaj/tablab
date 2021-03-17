import { Parser } from '../../src/parser/parser';
import { ParsedInstructionData } from '../../src/parser/parsed-instruction';
import { ParsedMethodInstructionData } from '../../src/parser/parsed-method-instruction';

const globalIndexReference = 5;

let parser: Parser;
beforeEach(() => {
  parser = new Parser();
});

describe(`[${Parser.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a parser with the default parameters if no configuration is given', () => {
      expect(parser.instructionsSeparator).toBe(Parser.DEFAULT_INSTRUCTIONS_SEPARATOR);
      expect(parser.methodInstructionAlias2IdentifierMap).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_ALIAS_2_IDENTIFIER_MAP
      );
      expect(parser.methodInstructionArgsSeparator).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_SEPARATOR
      );
      expect(parser.methodInstructionArgsOpeningEnclosure).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_ARGS_OPENING_ENCLOSURE
      );
      expect(parser.methodInstructionTargetsOpeningEnclosure).toBe(
        Parser.DEFAULT_METHOD_INSTRUCTION_TARGETS_OPENING_ENCLOSURE
      );
    });

    it('should set the instructionsSeparator if one is set at instantiation', () => {
      const instructionsSeparator = '@';
      const parser = new Parser({ instructionsSeparator });

      expect(parser.instructionsSeparator).toBe(instructionsSeparator);
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

    it('should set the methodInstructionArgsOpeningEnclosure if one is set at instantiation', () => {
      const methodInstructionArgsOpeningEnclosure = '<';
      const parser = new Parser({ methodInstructionArgsOpeningEnclosure });

      expect(parser.methodInstructionArgsOpeningEnclosure).toBe(
        methodInstructionArgsOpeningEnclosure
      );
    });

    it('should set the methodInstructionTargetsOpeningEnclosure if one is set at instantiation', () => {
      const methodInstructionTargetsOpeningEnclosure = '[';
      const parser = new Parser({ methodInstructionTargetsOpeningEnclosure });

      expect(parser.methodInstructionTargetsOpeningEnclosure).toBe(
        methodInstructionTargetsOpeningEnclosure
      );
    });
  });

  describe('[properties]', () => {
    describe('[instructionsSeparator]', () => {
      it('should set the instructionsSeparator property', () => {
        const instructionsSeparator = '@';

        parser.instructionsSeparator = instructionsSeparator;

        expect(parser.instructionsSeparator).toBe(instructionsSeparator);
      });

      it('should throw if the instructionsSeparator is set to a non single character string', () => {
        const instructionsSeparator = '@@';

        expect(() => (parser.instructionsSeparator = instructionsSeparator)).toThrow();
      });
    });

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

    describe('[methodInstructionArgsOpeningEnclosure]', () => {
      it('should set the methodInstructionArgsOpeningEnclosure property', () => {
        const methodInstructionArgsOpeningEnclosure = '<';

        parser.methodInstructionArgsOpeningEnclosure = methodInstructionArgsOpeningEnclosure;

        expect(parser.methodInstructionArgsOpeningEnclosure).toBe(
          methodInstructionArgsOpeningEnclosure
        );
      });

      it('should throw if methodInstructionArgsOpeningEnclosure is set to an invalid opening enclosure', () => {
        const methodInstructionArgsOpeningEnclosure = '%';

        expect(
          () =>
            (parser.methodInstructionArgsOpeningEnclosure = methodInstructionArgsOpeningEnclosure)
        ).toThrow();
      });
    });

    describe('[methodInstructionTargetsOpeningEnclosure]', () => {
      it('should set the methodInstructionTargetsOpeningEnclosure property', () => {
        const methodInstructionTargetsOpeningEnclosure = '[';

        parser.methodInstructionTargetsOpeningEnclosure = methodInstructionTargetsOpeningEnclosure;

        expect(parser.methodInstructionTargetsOpeningEnclosure).toBe(
          methodInstructionTargetsOpeningEnclosure
        );
      });

      it('should throw if methodInstructionTargetsOpeningEnclosure is set to an invalid opening enclosure', () => {
        const methodInstructionTargetsOpeningEnclosure = '%';

        expect(
          () =>
            (parser.methodInstructionTargetsOpeningEnclosure = methodInstructionTargetsOpeningEnclosure)
        ).toThrow();
      });
    });
  });

  describe('[parse single instruction]', () => {
    const nonMethodInstruction = '1-0';

    const getExpectedParsedNonMethodInstruction = (): ParsedInstructionData => {
      return {
        method: null,
        value: nonMethodInstruction,
        readFromIndex: 0,
        readToIndex: nonMethodInstruction.length - 1,
      };
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

        expectedParsedInstruction.readFromIndex += globalIndexReference;
        expectedParsedInstruction.readToIndex += globalIndexReference;

        const parsedInstruction = parser.parseOne(nonMethodInstruction, globalIndexReference);

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
        const methodInstructionArgsOpeningEnclosure = '<';
        const args = ['1', '1.11', 'some text argument'];
        const instruction = `instr<${args.join(methodInstructionArgsSeparator)}>`;

        const parser = new Parser({
          methodInstructionArgsSeparator,
          methodInstructionArgsOpeningEnclosure,
        });

        const parsedInstruction = parser.parseOne(instruction);

        expect(parsedInstruction?.method?.args).toEqual(args);
      });

      it('should parse the arguments of a method instruction when available, even with spaces', () => {
        const methodInstructionArgsSeparator = '|';
        const methodInstructionArgsOpeningEnclosure = '<';
        const args = ['1', '1.11', 'some text input'];
        const instruction = `  instr  <  ${args.join(
          `  ${methodInstructionArgsSeparator}  `
        )}  >  `;

        const parser = new Parser({
          methodInstructionArgsSeparator,
          methodInstructionArgsOpeningEnclosure,
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
        const methodInstructionTargetsOpeningEnclosure = '[';

        const targets = ['1-2', '2-3'];
        const instruction = `instr[${targets.join(' ')}]`;
        const parser = new Parser({
          methodInstructionTargetsOpeningEnclosure,
        });

        const parsedInstruction = parser.parseOne(instruction);
        const parsedTargets = parsedInstruction?.method?.targets?.map((target) => target.value);

        expect(parsedTargets).toEqual(targets);
      });

      it('should parse the targets of a method instruction when available, even with spaces', () => {
        const methodInstructionTargetsOpeningEnclosure = '[';

        const targets = ['1-2', '2-3'];
        const instruction = `  instr  [  ${targets.join('  ')}  ]  `;
        const parser = new Parser({
          methodInstructionTargetsOpeningEnclosure,
        });

        const parsedInstruction = parser.parseOne(instruction);
        const parsedTargets = parsedInstruction?.method?.targets?.map((target) => target.value);

        expect(parsedTargets).toEqual(targets);
      });

      it('should parse the targets of a method instruction as an empty array when not available', () => {
        const targets: ParsedInstructionData[] = [];
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
        await parser.parseOneAsync(instructions, globalIndexReference);

        expect(parser.parseOne).toHaveBeenCalledWith(instructions, globalIndexReference);
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

    const getExpectedParsedInstruction1 = (): ParsedInstructionData => {
      const instruction1StartIndexAtInstructions = instructions.indexOf(instruction1);

      return {
        method: null,
        value: instruction1,
        readFromIndex: instruction1StartIndexAtInstructions,
        readToIndex: instruction1StartIndexAtInstructions + instruction1.length - 1,
      };
    };

    const getExpectedParsedInstruction2 = (): ParsedInstructionData => {
      const instruction2StartIndexAtInstructions = instructions.indexOf(instruction2);

      return {
        method: {
          alias: 'methodInstruction',
          args: ['arg1', 'arg2'],
          identifier: null,
          targets: [],
        } as ParsedMethodInstructionData,
        value: instruction2,
        readFromIndex: instruction2StartIndexAtInstructions,
        readToIndex: instruction2StartIndexAtInstructions + instruction2.length - 1,
      };
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

        expectedParsedInstruction1.readFromIndex += globalIndexReference;
        expectedParsedInstruction1.readToIndex += globalIndexReference;
        expectedParsedInstruction2.readFromIndex += globalIndexReference;
        expectedParsedInstruction2.readToIndex += globalIndexReference;

        const parsedInstructions = parser.parseAll(instructions, globalIndexReference);

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
        await parser.parseAllAsync(instructions, globalIndexReference);

        expect(parser.parseAll).toHaveBeenCalledWith(instructions, globalIndexReference);
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
