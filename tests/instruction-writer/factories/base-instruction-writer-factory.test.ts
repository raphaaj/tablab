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

  protected buildTestInstructionWriter(): BaseInstructionWriter {
    return new TestInstructionWriter();
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
        const factory = new TestInstructionWriterFactoryBase();

        const alias = 'unknown';
        const instruction = alias;

        const instructionWriter = factory.getInstructionWriter({
          method: { alias, identifier: null, args: [], targets: [] },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        });

        expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
        expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
          InvalidInstructionReason.UnidentifiedMethodInstruction
        );
      });

      it('should return an invalid instruction writer if unable to get a method instruction builder from the method identifier', () => {
        const factory = new TestInstructionWriterFactoryBase();

        const alias = 'unknown';
        const identifier = 'unknown';
        const instruction = alias;

        const instructionWriter = factory.getInstructionWriter({
          method: { alias, identifier, args: [], targets: [] },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        });

        expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
        expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
          InvalidInstructionReason.UnknownMethodInstruction
        );
      });

      it('should return the instruction writer created with the method instruction builder mapped for the method identifier', () => {
        const factory = new TestInstructionWriterFactoryBase();

        const alias = 'testAlias';
        const identifier = TestInstructionWriterFactoryBase.TEST_METHOD_IDENTIFIER;
        const instruction = alias;

        const instructionWriter = factory.getInstructionWriter({
          method: { alias, identifier, args: [], targets: [] },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        });

        expect(instructionWriter).toBeInstanceOf(TestInstructionWriter);
      });
    });

    describe('[non method instruction]', () => {
      it('should return an invalid instruction writer if unable to extract a note from the instruction value', () => {
        const factory = new TestInstructionWriterFactoryBase();

        const instruction = 'unknown';

        const instructionWriter = factory.getInstructionWriter({
          method: null,
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        });

        expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
        expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
          InvalidInstructionReason.BasicInstructionInvalid
        );
      });

      it('should return a note instruction writer if a note is successfully extracted from the instruction value', () => {
        const factory = new TestInstructionWriterFactoryBase();

        const string = 1;
        const fret = '0';
        const instruction = `${string}-${fret}`;

        const instructionWriter = factory.getInstructionWriter({
          method: null,
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        });

        expect(instructionWriter).toBeInstanceOf(NoteInstructionWriter);
        expect((instructionWriter as NoteInstructionWriter).note.string).toBe(string);
        expect((instructionWriter as NoteInstructionWriter).note.fret).toBe(fret);
      });
    });
  });

  describe('[validateMethodArgumentForNumberValue]', () => {
    it('should return the given invalid instruction writer if the given argument is not a number value', () => {
      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg: 'not a number',
        invalidInstructionWriterIfNaN,
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfNaN);
    });

    it('should return null if the given argument is a number and no range validation is set', () => {
      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg: '123',
        invalidInstructionWriterIfNaN,
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the given argument is smaller than the given minimum accepted value', () => {
      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfSmaller = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_SMALLER_THAN_MINIMUM',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg: '123',
        invalidInstructionWriterIfNaN,
        minValueValidation: {
          minValue: 200,
          invalidInstructionWriterIfSmaller,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfSmaller);
    });

    it('should return null if the given argument is not smaller than the given minimum accepted value', () => {
      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfSmaller = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_SMALLER_THAN_MINIMUM',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg: '321',
        invalidInstructionWriterIfNaN,
        minValueValidation: {
          minValue: 200,
          invalidInstructionWriterIfSmaller,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the given argument is greater than the given maximum accepted value', () => {
      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfGreater = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_GREATER_THAN_MAXIMUM',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg: '321',
        invalidInstructionWriterIfNaN,
        maxValueValidation: {
          maxValue: 200,
          invalidInstructionWriterIfGreater,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfGreater);
    });

    it('should return null if the given argument is not greater than the given maximum accepted value', () => {
      const invalidInstructionWriterIfNaN = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_NOT_A_NUMBER',
        description: 'test description',
      });
      const invalidInstructionWriterIfGreater = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_GREATER_THAN_MAXIMUM',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testMethodArgumentForNumberValueValidation({
        arg: '123',
        invalidInstructionWriterIfNaN,
        maxValueValidation: {
          maxValue: 200,
          invalidInstructionWriterIfGreater,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });
  });

  describe('[validateNumberOfMethodArguments]', () => {
    it('should return the given invalid instruction writer if the number of arguments is smaller than the given minimum number of accepted arguments', () => {
      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_MISSING_ARGUMENTS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args: [],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfLess);
    });

    it('should return null if the number of arguments is not smaller than the given minimum number of accepted arguments', () => {
      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_MISSING_ARGUMENTS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args: ['arg1'],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the number of arguments is greater than the given maximum number of accepted arguments', () => {
      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_TOO_MANY_ARGUMENTS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args: ['arg1'],
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionWriterIfMore,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfMore);
    });

    it('should return null if the number of arguments is not greater than the given maximum number of accepted arguments', () => {
      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_TOO_MANY_ARGUMENTS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testNumberOfMethodArgumentsValidation({
        args: [],
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
      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_MISSING_TARGETS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: [],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfLess);
    });

    it('should return null if the number of targets is not smaller than the given minimum number of accepted targets', () => {
      const invalidInstructionWriterIfLess = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_MISSING_TARGETS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const targetInstruction = '1-0';
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: [
          {
            method: null,
            readFromIndex: 0,
            readToIndex: targetInstruction.length,
            value: targetInstruction,
          },
        ],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionWriterIfLess,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(null);
    });

    it('should return the given invalid instruction writer if the number of targets is greater than the given maximum number of accepted targets', () => {
      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_TOO_MANY_TARGETS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const targetInstruction = '1-0';
      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: [
          {
            method: null,
            readFromIndex: 0,
            readToIndex: targetInstruction.length,
            value: targetInstruction,
          },
        ],
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionWriterIfMore,
        },
      });

      expect(invalidArgumentInstructionWriter).toBe(invalidInstructionWriterIfMore);
    });

    it('should return null if the number of targets is not greater than the given maximum number of accepted targets', () => {
      const invalidInstructionWriterIfMore = new BaseInvalidInstructionWriter({
        reasonIdentifier: 'TEST_REASON_TOO_MANY_TARGETS',
        description: 'test description',
      });
      const factory = new TestInstructionWriterFactoryBase();

      const invalidArgumentInstructionWriter = factory.testNumberOfMethodTargetsValidation({
        targets: [],
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
