import { Parser } from '../../src/parser/parser';

describe(`[${Parser.name}]`, () => {
  describe('[constructor]', () => {
    it('should create a parser with the default parameters if no configuration is given', () => {
      const parser = new Parser();

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

    it('should set instructionsSeparator if one is set at instantiation', () => {
      const instructionsSeparator = '@';
      const parser = new Parser({ instructionsSeparator });

      expect(parser.instructionsSeparator).toBe(instructionsSeparator);
    });

    it('should set methodInstructionAlias2IdentifierMap if one is set at instantiation', () => {
      const alias2IdentifierMap: Record<string, string> = {};
      const parser = new Parser({ methodInstructionAlias2IdentifierMap: alias2IdentifierMap });

      expect(parser.methodInstructionAlias2IdentifierMap).toBe(alias2IdentifierMap);
    });

    it('should set methodInstructionArgsSeparator if one is set at instantiation', () => {
      const methodInstructionArgsSeparator = '|';
      const parser = new Parser({ methodInstructionArgsSeparator });

      expect(parser.methodInstructionArgsSeparator).toBe(methodInstructionArgsSeparator);
    });

    it('should set methodInstructionArgsOpeningEnclosure if one is set at instantiation', () => {
      const methodInstructionArgsOpeningEnclosure = '<';
      const parser = new Parser({ methodInstructionArgsOpeningEnclosure });

      expect(parser.methodInstructionArgsOpeningEnclosure).toBe(
        methodInstructionArgsOpeningEnclosure
      );
    });

    it('should set methodInstructionTargetsOpeningEnclosure if one is set at instantiation', () => {
      const methodInstructionTargetsOpeningEnclosure = '[';
      const parser = new Parser({ methodInstructionTargetsOpeningEnclosure });

      expect(parser.methodInstructionTargetsOpeningEnclosure).toBe(
        methodInstructionTargetsOpeningEnclosure
      );
    });
  });

  describe('[properties]', () => {
    it('should set instructionsSeparator', () => {
      const instructionsSeparator = '@';
      const parser = new Parser();

      parser.instructionsSeparator = instructionsSeparator;

      expect(parser.instructionsSeparator).toBe(instructionsSeparator);
    });

    it('should set methodInstructionArgsSeparator', () => {
      const methodInstructionArgsSeparator = '|';
      const parser = new Parser();

      parser.methodInstructionArgsSeparator = methodInstructionArgsSeparator;

      expect(parser.methodInstructionArgsSeparator).toBe(methodInstructionArgsSeparator);
    });

    it('should set methodInstructionArgsOpeningEnclosure', () => {
      const methodInstructionArgsOpeningEnclosure = '<';
      const parser = new Parser();

      parser.methodInstructionArgsOpeningEnclosure = methodInstructionArgsOpeningEnclosure;

      expect(parser.methodInstructionArgsOpeningEnclosure).toBe(
        methodInstructionArgsOpeningEnclosure
      );
    });

    it('should set methodInstructionTargetsOpeningEnclosure', () => {
      const methodInstructionTargetsOpeningEnclosure = '[';
      const parser = new Parser();

      parser.methodInstructionTargetsOpeningEnclosure = methodInstructionTargetsOpeningEnclosure;

      expect(parser.methodInstructionTargetsOpeningEnclosure).toBe(
        methodInstructionTargetsOpeningEnclosure
      );
    });

    it('should throw if instructionsSeparator is set to a non single character string', () => {
      const instructionsSeparator = '@@';
      const parser = new Parser();

      expect(() => (parser.instructionsSeparator = instructionsSeparator)).toThrow();
    });

    it('should throw if methodInstructionArgsSeparator is set to a non single character string', () => {
      const methodInstructionArgsSeparator = '||';
      const parser = new Parser();

      expect(
        () => (parser.methodInstructionArgsSeparator = methodInstructionArgsSeparator)
      ).toThrow();
    });

    it('should throw if methodInstructionArgsOpeningEnclosure is set to an invalid opening enclosure', () => {
      const methodInstructionArgsOpeningEnclosure = '%';
      const parser = new Parser();

      expect(
        () => (parser.methodInstructionArgsOpeningEnclosure = methodInstructionArgsOpeningEnclosure)
      ).toThrow();
    });

    it('should throw if methodInstructionTargetsOpeningEnclosure is set to an invalid opening enclosure', () => {
      const methodInstructionTargetsOpeningEnclosure = '%';
      const parser = new Parser();

      expect(
        () =>
          (parser.methodInstructionTargetsOpeningEnclosure = methodInstructionTargetsOpeningEnclosure)
      ).toThrow();
    });
  });

  describe('[parseOne]', () => {
    it('should return a null result if the given instruction string is empty', () => {
      const instruction = '     ';
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);

      expect(parserResult).toBeNull();
    });

    it('should parse a instruction with enclosures as a single instruction', () => {
      const instruction = 'instr(arg1, arg2)[arg1, arg2]{arg1, arg2}<arg1, arg3>';
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);

      expect(parserResult?.value).toBe(instruction);
    });

    it('should parse a instruction with enclosures as a single instruction, even with spaces between', () => {
      const instruction =
        '  instr1  (  arg1  ,  arg2  )  [  arg1  ,  arg2  ]  {  arg1  ,  arg2  }  <  arg1  ,  arg2  >  ';
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);

      expect(parserResult?.value).toBe(instruction.trim());
    });

    it('should parse a instruction with no matching closing enclosure to the end of the instruction string', () => {
      const instruction = 'instr2(arg1, arg2[arg1, arg2]{arg1, arg2}<arg1, arg2>';
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);

      expect(parserResult?.value).toBe(instruction);
    });

    it('should parse a instruction with no matching closing enclosure to the end of the instruction string, even with spaces between', () => {
      const instruction = '  instr1  (  arg1  ,  arg2  )  [  arg1  ,  arg2  ]  {  arg1  ,  arg2  ';
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);

      expect(parserResult?.value).toBe(instruction.trim());
    });

    it('should read the instruction arguments', () => {
      const methodInstructionArgsSeparator = '|';
      const methodInstructionArgsOpeningEnclosure = '<';

      const args = ['1', '1.11', 'some text input'];
      const instruction = `instr<${args.join(methodInstructionArgsSeparator)}>`;
      const parser = new Parser({
        methodInstructionArgsSeparator,
        methodInstructionArgsOpeningEnclosure,
      });

      const parserResult = parser.parseOne(instruction);

      expect(parserResult?.method?.args).toEqual(args);
    });

    it('should read the instruction arguments, even with spaces', () => {
      const methodInstructionArgsSeparator = '|';
      const methodInstructionArgsOpeningEnclosure = '<';

      const args = ['1', '1.11', 'some text input'];
      const instruction = `  instr  <  ${args.join(`  ${methodInstructionArgsSeparator}  `)}  >  `;
      const parser = new Parser({
        methodInstructionArgsSeparator,
        methodInstructionArgsOpeningEnclosure,
      });

      const parserResult = parser.parseOne(instruction);

      expect(parserResult?.method?.args).toEqual(args);
    });

    it('should read the instruction targets', () => {
      const methodInstructionTargetsOpeningEnclosure = '[';

      const targets = ['1-2', '2-3'];
      const instruction = `instr[${targets.join(' ')}]`;
      const parser = new Parser({
        methodInstructionTargetsOpeningEnclosure,
      });

      const parserResult = parser.parseOne(instruction);
      const resultTargetValues = parserResult?.method?.targets?.map((target) => target.value);

      expect(resultTargetValues).toEqual(targets);
    });

    it('should read the instruction targets, even with spaces', () => {
      const methodInstructionTargetsOpeningEnclosure = '[';

      const targets = ['1-2', '2-3'];
      const instruction = `  instr  [  ${targets.join('  ')}  ]  `;
      const parser = new Parser({
        methodInstructionTargetsOpeningEnclosure,
      });

      const parserResult = parser.parseOne(instruction);
      const resultTargetValues = parserResult?.method?.targets?.map((target) => target.value);

      expect(resultTargetValues).toEqual(targets);
    });

    it('should keep inner targets positions at the global reference', () => {
      const innerTargets = ['6-1', '6-2'];
      const target = `instr{${innerTargets.join(' ')}}`;
      const instruction = `instr{${target}}`;
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);
      const resultTargets = parserResult?.method?.targets;
      const resultInnerTargets = resultTargets ? resultTargets[0]?.method?.targets : null;

      expect(resultInnerTargets).not.toBeNull();
      expect(resultInnerTargets).toBeDefined();
      if (resultInnerTargets) {
        innerTargets.forEach((target, idx) => {
          expect(resultInnerTargets[idx].value).toBe(target);
          expect(resultInnerTargets[idx].readFromIndex).toBe(instruction.indexOf(target));
          expect(resultInnerTargets[idx].readToIndex).toBe(
            instruction.indexOf(target) + target.length - 1
          );
        });
      }
    });

    it('should keep inner targets positions at the global reference, even with spaces', () => {
      const innerTargets = ['6-1', '6-2'];
      const target = `  instr  {  ${innerTargets.join('  ')}  }  `;
      const instruction = `  instr  {  ${target}  }  `;
      const parser = new Parser();

      const parserResult = parser.parseOne(instruction);
      const resultTargets = parserResult?.method?.targets;
      const resultInnerTargets = resultTargets ? resultTargets[0]?.method?.targets : null;

      expect(resultInnerTargets).not.toBeNull();
      expect(resultInnerTargets).toBeDefined();
      if (resultInnerTargets) {
        innerTargets.forEach((target, idx) => {
          expect(resultInnerTargets[idx].value).toBe(target);
          expect(resultInnerTargets[idx].readFromIndex).toBe(instruction.indexOf(target));
          expect(resultInnerTargets[idx].readToIndex).toBe(
            instruction.indexOf(target) + target.length - 1
          );
        });
      }
    });
  });

  describe('[parseOneAsync]', () => {
    it('should resolve with parseOne result on success', async () => {
      const instructions = ' someInstruction ';
      const expectedResult = 'someResult';
      const parser = new Parser();
      parser.parseOne = jest.fn().mockResolvedValue(expectedResult);

      const result = await parser.parseOneAsync(instructions);

      expect(parser.parseOne).toHaveBeenCalledWith(instructions);
      expect(result).toBe(expectedResult);
    });

    it('should reject if an error occurs', async () => {
      expect.assertions(2);

      const instructions = ' someInstruction ';
      const expectedError = new Error('test');
      const parser = new Parser();
      parser.parseOne = jest.fn(() => {
        throw expectedError;
      });

      await expect(parser.parseOneAsync(instructions)).rejects.toBe(expectedError);
      expect(parser.parseOne).toHaveBeenCalledWith(instructions);
    });
  });

  describe(`[parseAll]`, () => {
    it('should parse all instructions from the instructions string', () => {
      const instruction1 = ' instr1 ( 1 , 2 ) { 1-1 1-2 1-3 } ';
      const instruction2 = ' instr2 ( someArg1, someArg2 ) { someOtherInstr } ';
      const instructions = ` ${instruction1} ${instruction2} `;
      const parser = new Parser();

      const parserResult = parser.parseAll(instructions);

      expect(parserResult.length).toBe(2);
      expect(parserResult[0].value).toBe(instruction1.trim());
      expect(parserResult[1].value).toBe(instruction2.trim());
    });
  });

  describe('[parseAllAsync]', () => {
    it('should resolve with parseAll result on success', async () => {
      const instructions = ' someInstruction ';
      const expectedResult = 'someResult';
      const parser = new Parser();
      parser.parseAll = jest.fn().mockResolvedValue(expectedResult);

      const result = await parser.parseAllAsync(instructions);

      expect(parser.parseAll).toHaveBeenCalledWith(instructions);
      expect(result).toBe(expectedResult);
    });

    it('should reject if an error occurs', async () => {
      expect.assertions(2);

      const instructions = ' someInstruction ';
      const expectedError = new Error('test');
      const parser = new Parser();
      parser.parseAll = jest.fn(() => {
        throw expectedError;
      });

      await expect(parser.parseAllAsync(instructions)).rejects.toBe(expectedError);
      expect(parser.parseAll).toHaveBeenCalledWith(instructions);
    });
  });
});
