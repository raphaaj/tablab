import { NumberType } from '../../../src/helpers/number-helper';
import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import {
  ArgumentNumberValidationOptions,
  ArgumentsValidationOptions,
  BaseInstructionWriterFactory,
  MethodInstructionWriterBuilder,
  TargetsValidationOptions,
} from '../../../src/instruction-writer/factories/base-instruction-writer-factory';
import { BaseInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-instruction-writer';
import { BaseInvalidInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-invalid-instruction-writer';
import { NoteInstructionWriter } from '../../../src/instruction-writer/instruction-writers/note-instruction-writer';
import { BaseWriteResult } from '../../../src/instruction-writer/write-results/base-write-result';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';

class TestInstructionWriter extends BaseInstructionWriter {
  protected internalWriteOnTab(): BaseWriteResult {
    throw new Error('Method not implemented.');
  }
}

class TestInstructionWriterFactoryBase extends BaseInstructionWriterFactory {
  static readonly TEST_METHOD_IDENTIFIER = 'testIdentifier';

  protected methodInstructionIdentifier2InstructionWriterBuilderMap: Record<
    string,
    MethodInstructionWriterBuilder
  >;

  constructor() {
    super();

    this.methodInstructionIdentifier2InstructionWriterBuilderMap = {
      [TestInstructionWriterFactoryBase.TEST_METHOD_IDENTIFIER]:
        this.buildTestInstructionWriter.bind(this),
    };
  }

  testMethodArgumentForNumberValueValidation(
    argumentValidation: ArgumentNumberValidationOptions
  ): BaseInvalidInstructionWriter | null {
    return this.validateMethodArgumentForNumberValue(argumentValidation);
  }

  testNumberOfMethodArgumentsValidation(
    argumentsValidation: ArgumentsValidationOptions
  ): BaseInvalidInstructionWriter | null {
    return this.validateNumberOfMethodArguments(argumentsValidation);
  }

  testNumberOfMethodTargetsValidation(
    targetsValidation: TargetsValidationOptions
  ): BaseInvalidInstructionWriter | null {
    return this.validateNumberOfMethodTargets(targetsValidation);
  }

  protected buildTestInstructionWriter(
    parsedInstruction: ParsedInstructionData
  ): BaseInstructionWriter {
    return new TestInstructionWriter({ parsedInstruction });
  }
}

describe(`[${BaseInstructionWriterFactory.name}]`, () => {
  describe('[properties]', () => {
    describe('[methodInstructionsEnabled]', () => {
      it('should return an array with all the method instruction identifiers with a mapped instruction writer builder at the factory', () => {
        const factory = new TestInstructionWriterFactoryBase();

        expect(factory.methodInstructionsEnabled).toEqual([
          TestInstructionWriterFactoryBase.TEST_METHOD_IDENTIFIER,
        ]);
      });
    });
  });

  describe('[getInstructionWriter]', () => {
    describe('[method instruction]', () => {
      it('should return an invalid instruction writer if the method instruction identifier is not set', () => {
        const alias = 'unknown';
        const instruction = alias;

        const parsedInstruction: ParsedInstructionData = {
          method: { alias, identifier: null, args: [], targets: [] },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        const factory = new TestInstructionWriterFactoryBase();
        const instructionWriter = factory.getInstructionWriter(parsedInstruction);

        expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
        expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
          InvalidInstructionReason.UnidentifiedMethodInstruction
        );
      });

      it('should return an invalid instruction writer if unable to get a method instruction builder from the method identifier', () => {
        const alias = 'unknown';
        const identifier = 'unknown';
        const instruction = alias;

        const parsedInstruction: ParsedInstructionData = {
          method: { alias, identifier, args: [], targets: [] },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        const factory = new TestInstructionWriterFactoryBase();
        const instructionWriter = factory.getInstructionWriter(parsedInstruction);

        expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
        expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
          InvalidInstructionReason.UnknownMethodInstruction
        );
      });

      it('should return the instruction writer created with the method instruction builder mapped for the method identifier', () => {
        const alias = 'testAlias';
        const identifier = TestInstructionWriterFactoryBase.TEST_METHOD_IDENTIFIER;
        const instruction = alias;

        const parsedInstruction: ParsedInstructionData = {
          method: { alias, identifier, args: [], targets: [] },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        const factory = new TestInstructionWriterFactoryBase();
        const instructionWriter = factory.getInstructionWriter(parsedInstruction);

        expect(instructionWriter).toBeInstanceOf(TestInstructionWriter);
      });
    });

    describe('[non method instruction]', () => {
      it('should return an invalid instruction writer if unable to extract a note from the instruction value', () => {
        const instruction = 'unknown';

        const parsedInstruction: ParsedInstructionData = {
          method: null,
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        const factory = new TestInstructionWriterFactoryBase();
        const instructionWriter = factory.getInstructionWriter(parsedInstruction);

        expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
        expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
          InvalidInstructionReason.BasicInstructionInvalid
        );
      });

      it('should return a note instruction writer if a note is successfully extracted from the instruction value', () => {
        const string = 1;
        const fret = '0';
        const instruction = `${string}-${fret}`;

        const parsedInstruction: ParsedInstructionData = {
          method: null,
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        const factory = new TestInstructionWriterFactoryBase();
        const instructionWriter = factory.getInstructionWriter(parsedInstruction);

        expect(instructionWriter).toBeInstanceOf(NoteInstructionWriter);
        expect((instructionWriter as NoteInstructionWriter).note.string).toBe(string);
        expect((instructionWriter as NoteInstructionWriter).note.fret).toBe(fret);
      });
    });
  });

  describe('[validateMethodArgumentForNumberValue]', () => {
    it('should return the given invalid instruction writer if the given argument is not a number value', () => {
      const alias = 'testAlias';
      const arg = 'not a number';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfNaN);
    });

    it('should return null if the given argument is a number and no range validation is set', () => {
      const alias = 'testAlias';
      const arg = '123';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the given argument is smaller than the given minimum accepted value', () => {
      const alias = 'testAlias';
      const arg = '123';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfSmaller = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_SMALLER_THAN_MINIMUM',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
        minValueValidation: {
          minValue: 200,
          invalidInstructionWriterIfSmaller,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfSmaller);
    });

    it('should return null if the given argument is not smaller than the given minimum accepted value', () => {
      const alias = 'testAlias';
      const arg = '321';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfSmaller = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_SMALLER_THAN_MINIMUM',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
        minValueValidation: {
          minValue: 200,
          invalidInstructionWriterIfSmaller,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the given argument is greater than the given maximum accepted value', () => {
      const alias = 'testAlias';
      const arg = '321';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfGreater = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_GREATER_THAN_MAXIMUM',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
        maxValueValidation: {
          maxValue: 200,
          invalidInstructionWriterIfGreater,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfGreater);
    });

    it('should return null if the given argument is not greater than the given maximum accepted value', () => {
      const alias = 'testAlias';
      const arg = '123';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfGreater = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_GREATER_THAN_MAXIMUM',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
        maxValueValidation: {
          maxValue: 200,
          invalidInstructionWriterIfGreater,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the given argument value number type is not listed among the accepted number types', () => {
      const alias = 'testAlias';
      const arg = '3.14';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfTypeNotAllowed = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_TYPE_NOT_ALLOWED',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
        numberTypeValidation: {
          allowedTypes: [NumberType.Integer],
          invalidInstructionWriterIfTypeNotAllowed,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfTypeNotAllowed);
    });

    it('should return null if the given argument value number type is listed among the accepted number types', () => {
      const alias = 'testAlias';
      const arg = '3';
      const instruction = `alias (${arg})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [arg], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfTypeNotAllowed = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_TYPE_NOT_ALLOWED',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg,
        invalidInstructionWriterIfNaN,
        numberTypeValidation: {
          allowedTypes: [NumberType.Integer],
          invalidInstructionWriterIfTypeNotAllowed,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });
  });

  describe('[validateNumberOfMethodArguments]', () => {
    it('should return the given invalid instruction writer if the number of arguments is smaller than the given minimum number of accepted arguments', () => {
      const alias = 'testAlias';
      const args: string[] = [];
      const instruction = `alias (${args.join(', ')})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args, targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_MISSING_ARGUMENTS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args,
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfLess);
    });

    it('should return null if the number of arguments is not smaller than the given minimum number of accepted arguments', () => {
      const alias = 'testAlias';
      const args = ['arg1'];
      const instruction = `alias (${args.join(', ')})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args, targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_MISSING_ARGUMENTS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args,
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the number of arguments is greater than the given maximum number of accepted arguments', () => {
      const alias = 'testAlias';
      const args = ['arg1'];
      const instruction = `alias (${args.join(', ')})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args, targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_TOO_MANY_ARGUMENTS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args,
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionWriterIfMore,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfMore);
    });

    it('should return null if the number of arguments is not greater than the given maximum number of accepted arguments', () => {
      const alias = 'testAlias';
      const args: string[] = [];
      const instruction = `alias (${args.join(', ')})`;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args, targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_TOO_MANY_ARGUMENTS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args,
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionWriterIfMore,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });
  });

  describe('[validateNumberOfTargets]', () => {
    it('should return the given invalid instruction writer if the number of targets is smaller than the given minimum number of accepted targets', () => {
      const alias = 'testAlias';
      const targets: string[] = [];
      const instruction = `alias {${targets.join(', ')}}`;

      const parsedInstructionTargets = targets.map((target) => {
        const readFromIndex = instruction.indexOf(target);

        return {
          method: null,
          readFromIndex,
          readToIndex: readFromIndex + target.length,
          value: target,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [], targets: parsedInstructionTargets },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_MISSING_TARGETS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: parsedInstructionTargets,
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfLess);
    });

    it('should return null if the number of targets is not smaller than the given minimum number of accepted targets', () => {
      const alias = 'testAlias';
      const targets = ['1-0'];
      const instruction = `alias {${targets.join(', ')}}`;

      const parsedInstructionTargets = targets.map((target) => {
        const readFromIndex = instruction.indexOf(target);

        return {
          method: null,
          readFromIndex,
          readToIndex: readFromIndex + target.length,
          value: target,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [], targets: parsedInstructionTargets },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_MISSING_TARGETS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: parsedInstructionTargets,
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the number of targets is greater than the given maximum number of accepted targets', () => {
      const alias = 'testAlias';
      const targets = ['1-0'];
      const instruction = `alias {${targets.join(', ')}}`;

      const parsedInstructionTargets = targets.map((target) => {
        const readFromIndex = instruction.indexOf(target);

        return {
          method: null,
          readFromIndex,
          readToIndex: readFromIndex + target.length,
          value: target,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [], targets: parsedInstructionTargets },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_TOO_MANY_TARGETS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: parsedInstructionTargets,
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionWriterIfMore,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfMore);
    });

    it('should return null if the number of targets is not greater than the given maximum number of accepted targets', () => {
      const alias = 'testAlias';
      const targets: string[] = [];
      const instruction = `alias {${targets.join(', ')}}`;

      const parsedInstructionTargets = targets.map((target) => {
        const readFromIndex = instruction.indexOf(target);

        return {
          method: null,
          readFromIndex,
          readToIndex: readFromIndex + target.length,
          value: target,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [], targets: parsedInstructionTargets },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        parsedInstruction,
        reasonIdentifier: 'TEST_REASON_TOO_MANY_TARGETS',
        description: 'test description',
      });

      const factory = new TestInstructionWriterFactoryBase();
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: parsedInstructionTargets,
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionWriterIfMore,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });
  });

  describe('[edge case validations]', () => {
    it('should throw if tries to get a method instruction writer from a non method parsed instruction', () => {
      const factory = new TestInstructionWriterFactoryBase();

      const testInstructionWriterFactoryBasePrototype =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        TestInstructionWriterFactoryBase.prototype as any;

      const oldGetInstructionWriterForMethodInstruction =
        testInstructionWriterFactoryBasePrototype._getInstructionWriterForMethodInstruction;

      const getInstructionWriterForMethodInstructionSpy = jest
        .spyOn(
          testInstructionWriterFactoryBasePrototype,
          '_getInstructionWriterForMethodInstruction'
        )
        .mockImplementationOnce((parsedInstruction) => {
          (parsedInstruction as ParsedInstructionData).method = null;
          return oldGetInstructionWriterForMethodInstruction(parsedInstruction);
        });

      const alias = 'unknown';
      const instruction = alias;

      const parsedInstruction: ParsedInstructionData = {
        method: { alias, identifier: null, args: [], targets: [] },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      expect(() => factory.getInstructionWriter(parsedInstruction)).toThrow();
      expect(getInstructionWriterForMethodInstructionSpy).toHaveBeenCalled();

      getInstructionWriterForMethodInstructionSpy.mockRestore();
    });
  });
});
