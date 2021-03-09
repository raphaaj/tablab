import { InvalidInstructionBaseReason } from '../../../src/instruction/core/enums/invalid-instruction-base-reason';
import { InstructionBase } from '../../../src/instruction/core/instruction-base';
import {
  ArgumentNumberValidation,
  ArgumentsValidation,
  InstructionBuilder,
  InstructionFactoryBase,
  TargetsValidation,
} from '../../../src/instruction/core/instruction-factory-base';
import { InstructionWriteResult } from '../../../src/instruction/core/instruction-write-result';
import { InvalidInstruction } from '../../../src/instruction/core/invalid-instruction';
import { WriteNoteInstruction } from '../../../src/instruction/core/write-note-instruction';

const TEST_METHOD_IDENTIFIER = 'testIdentifier';

class TestInstruction extends InstructionBase {
  writeOnTab(): InstructionWriteResult {
    throw new Error('Method not implemented.');
  }
}

class TestInstructionFactoryBase extends InstructionFactoryBase {
  protected instructionMethodIdentifier2InstructionBuilderMap: Record<string, InstructionBuilder>;

  constructor() {
    super();

    this.instructionMethodIdentifier2InstructionBuilderMap = {
      [TEST_METHOD_IDENTIFIER]: this.buildTestInstruction.bind(this),
    };
  }

  testMethodArgumentForNumberValueValidation(
    argumentValidation: ArgumentNumberValidation
  ): InvalidInstruction | null {
    return this.validateMethodArgumentForNumberValue(argumentValidation);
  }

  testNumberOfMethodArgumentsValidation(
    argumentsValidation: ArgumentsValidation
  ): InvalidInstruction | null {
    return this.validateNumberOfMethodArguments(argumentsValidation);
  }

  testNumberOfTargetsValidation(targetsValidation: TargetsValidation): InvalidInstruction | null {
    return this.validateNumberOfTargets(targetsValidation);
  }

  protected buildTestInstruction(): InstructionBase {
    return new TestInstruction();
  }
}

describe(`[${InstructionFactoryBase.name}]`, () => {
  describe('[properties]', () => {
    describe('[instructionMethodIdentifiersEnabled]', () => {
      it('should return an array with all the instruction method idenfiers with a instruction builder set at the factory', () => {
        const factory = new TestInstructionFactoryBase();

        expect(factory.instructionMethodIdentifiersEnabled).toEqual([TEST_METHOD_IDENTIFIER]);
      });
    });
  });

  describe('[getInstruction]', () => {
    describe('[method instruction]', () => {
      it('should return an invalid instruction if no method identifier is set', () => {
        const factory = new TestInstructionFactoryBase();

        const instruction = factory.getInstruction({
          value: 'unknown',
          method: { args: [], targets: [], identifier: null },
        });

        expect(instruction).toBeInstanceOf(InvalidInstruction);
        expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
          InvalidInstructionBaseReason.MethodInstructionWithoutIdentifier
        );
      });

      it('should return an invalid instruction if no instruction builder is found for the given method identifier', () => {
        const factory = new TestInstructionFactoryBase();

        const instruction = factory.getInstruction({
          value: 'unknown',
          method: { args: [], targets: [], identifier: 'unknown' },
        });

        expect(instruction).toBeInstanceOf(InvalidInstruction);
        expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
          InvalidInstructionBaseReason.MethodInstructionWithUnmappedIdentifier
        );
      });

      it('should return the instruction created with the instruction builder mapped for the given method identifier', () => {
        const factory = new TestInstructionFactoryBase();

        const instruction = factory.getInstruction({
          value: TEST_METHOD_IDENTIFIER,
          method: { args: [], targets: [], identifier: TEST_METHOD_IDENTIFIER },
        });

        expect(instruction).toBeInstanceOf(TestInstruction);
      });
    });

    describe('[non method instruction]', () => {
      it('should return an invalid instruction if unable to extract a note from the instruction value', () => {
        const factory = new TestInstructionFactoryBase();

        const instruction = factory.getInstruction({
          value: 'unknown',
          method: null,
        });

        expect(instruction).toBeInstanceOf(InvalidInstruction);
        expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
          InvalidInstructionBaseReason.WriteNoteInstructionInvalid
        );
      });

      it('should return a write note instruction if a note is successfully extracted from the instruction value', () => {
        const string = 1;
        const fret = '0';
        const factory = new TestInstructionFactoryBase();

        const instruction = factory.getInstruction({
          value: `${string}-${fret}`,
          method: null,
        });

        expect(instruction).toBeInstanceOf(WriteNoteInstruction);
        expect((instruction as WriteNoteInstruction).note.string).toBe(string);
        expect((instruction as WriteNoteInstruction).note.fret).toBe(fret);
      });
    });
  });

  describe('[validateMethodArgumentForNumberValue]', () => {
    it('should return the given invalid instruction if the given argument is not a number value', () => {
      const invalidInstructionIfNan = new InvalidInstruction('TEST_REASON_NOT_A_NUMBER');
      const factory = new TestInstructionFactoryBase();

      const invalidArgument = factory.testMethodArgumentForNumberValueValidation({
        arg: 'not a number',
        invalidInstructionIfNaN: invalidInstructionIfNan,
      });

      expect(invalidArgument).toBe(invalidInstructionIfNan);
    });

    it('should return null if the given argument is a number and no range validation is set', () => {
      const invalidInstructionIfNan = new InvalidInstruction('TEST_REASON_NOT_A_NUMBER');
      const factory = new TestInstructionFactoryBase();

      const invalidArgument = factory.testMethodArgumentForNumberValueValidation({
        arg: '123',
        invalidInstructionIfNaN: invalidInstructionIfNan,
      });

      expect(invalidArgument).toBe(null);
    });

    it('should return the given invalid instruction if the given argument is smaller than the given minimum accepted value', () => {
      const invalidInstructionIfNan = new InvalidInstruction('TEST_REASON_NOT_A_NUMBER');
      const invalidInstructionIfSmaller = new InvalidInstruction(
        'TEST_REASON_SMALLER_THAN_MINIMUM'
      );
      const factory = new TestInstructionFactoryBase();

      const invalidArgument = factory.testMethodArgumentForNumberValueValidation({
        arg: '123',
        invalidInstructionIfNaN: invalidInstructionIfNan,
        minValueValidation: {
          minValue: 200,
          invalidInstructionIfSmaller: invalidInstructionIfSmaller,
        },
      });

      expect(invalidArgument).toBe(invalidInstructionIfSmaller);
    });

    it('should return null if the given argument is not smaller than the given minimum accepted value', () => {
      const invalidInstructionIfNan = new InvalidInstruction('TEST_REASON_NOT_A_NUMBER');
      const invalidInstructionIfSmaller = new InvalidInstruction(
        'TEST_REASON_SMALLER_THAN_MINIMUM'
      );
      const factory = new TestInstructionFactoryBase();

      const invalidArgument = factory.testMethodArgumentForNumberValueValidation({
        arg: '321',
        invalidInstructionIfNaN: invalidInstructionIfNan,
        minValueValidation: {
          minValue: 200,
          invalidInstructionIfSmaller: invalidInstructionIfSmaller,
        },
      });

      expect(invalidArgument).toBe(null);
    });

    it('should return the given invalid instruction if the given argument is greater than the given maximum accepted value', () => {
      const invalidInstructionIfNan = new InvalidInstruction('TEST_REASON_NOT_A_NUMBER');
      const invalidInstructionIfGreater = new InvalidInstruction(
        'TEST_REASON_GREATER_THAN_MAXIMUM'
      );
      const factory = new TestInstructionFactoryBase();

      const invalidArgument = factory.testMethodArgumentForNumberValueValidation({
        arg: '321',
        invalidInstructionIfNaN: invalidInstructionIfNan,
        maxValueValidation: {
          maxValue: 200,
          invalidInstructionIfGreater: invalidInstructionIfGreater,
        },
      });

      expect(invalidArgument).toBe(invalidInstructionIfGreater);
    });

    it('should return null if the given argument is not greater than the given maximum accepted value', () => {
      const invalidInstructionIfNan = new InvalidInstruction('TEST_REASON_NOT_A_NUMBER');
      const invalidInstructionIfGreater = new InvalidInstruction(
        'TEST_REASON_GREATER_THAN_MAXIMUM'
      );
      const factory = new TestInstructionFactoryBase();

      const invalidArgument = factory.testMethodArgumentForNumberValueValidation({
        arg: '123',
        invalidInstructionIfNaN: invalidInstructionIfNan,
        maxValueValidation: {
          maxValue: 200,
          invalidInstructionIfGreater: invalidInstructionIfGreater,
        },
      });

      expect(invalidArgument).toBe(null);
    });
  });

  describe('[validateNumberOfMethodArguments]', () => {
    it('should return the given invalid instruction if the number of arguments is smaller than the given minimum number of accepted arguments', () => {
      const invalidInstructionIfLess = new InvalidInstruction('TEST_REASON_MISSING_ARGUMENTS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfMethodArgumentsValidation({
        args: [],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionIfLess: invalidInstructionIfLess,
        },
      });

      expect(invalidArguments).toBe(invalidInstructionIfLess);
    });

    it('should return null if the number of arguments is not smaller than the given minimum number of accepted arguments', () => {
      const invalidInstructionIfLess = new InvalidInstruction('TEST_REASON_MISSING_ARGUMENTS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfMethodArgumentsValidation({
        args: ['arg1'],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionIfLess: invalidInstructionIfLess,
        },
      });

      expect(invalidArguments).toBe(null);
    });

    it('should return the given invalid instruction if the number of arguments is greater than the given maximum number of accepted arguments', () => {
      const invalidInstructionIfMore = new InvalidInstruction('TEST_REASON_TOO_MANY_ARGUMENTS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfMethodArgumentsValidation({
        args: ['arg1'],
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionIfMore: invalidInstructionIfMore,
        },
      });

      expect(invalidArguments).toBe(invalidInstructionIfMore);
    });

    it('should return null if the number of arguments is not greater than the given maximum number of accepted arguments', () => {
      const invalidInstructionIfMore = new InvalidInstruction('TEST_REASON_TOO_MANY_ARGUMENTS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfMethodArgumentsValidation({
        args: [],
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionIfMore: invalidInstructionIfMore,
        },
      });

      expect(invalidArguments).toBe(null);
    });
  });

  describe('[validateNumberOfTargets]', () => {
    it('should return the given invalid instruction if the number of targets is smaller than the given minimum number of accepted targets', () => {
      const invalidInstructionIfLess = new InvalidInstruction('TEST_REASON_MISSING_TARGETS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfTargetsValidation({
        targets: [],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionIfLess: invalidInstructionIfLess,
        },
      });

      expect(invalidArguments).toBe(invalidInstructionIfLess);
    });

    it('should return null if the number of targets is not smaller than the given minimum number of accepted targets', () => {
      const invalidInstructionIfLess = new InvalidInstruction('TEST_REASON_MISSING_TARGETS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfTargetsValidation({
        targets: [{ value: '1-0', method: null }],
        minNumberValidation: {
          minNumber: 1,
          invalidInstructionIfLess: invalidInstructionIfLess,
        },
      });

      expect(invalidArguments).toBe(null);
    });

    it('should return the given invalid instruction if the number of targets is greater than the given maximum number of accepted targets', () => {
      const invalidInstructionIfMore = new InvalidInstruction('TEST_REASON_TOO_MANY_TARGETS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfTargetsValidation({
        targets: [{ value: '1-0', method: null }],
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionIfMore: invalidInstructionIfMore,
        },
      });

      expect(invalidArguments).toBe(invalidInstructionIfMore);
    });

    it('should return null if the number of targets is not greater than the given maximum number of accepted targets', () => {
      const invalidInstructionIfMore = new InvalidInstruction('TEST_REASON_TOO_MANY_TARGETS');
      const factory = new TestInstructionFactoryBase();

      const invalidArguments = factory.testNumberOfTargetsValidation({
        targets: [],
        maxNumberValidation: {
          maxNumber: 0,
          invalidInstructionIfMore: invalidInstructionIfMore,
        },
      });

      expect(invalidArguments).toBe(null);
    });
  });
});