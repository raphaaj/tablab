import { InstructionFactory } from '../../../src/instruction/factories/instruction-factory';
import { MethodInstructionIdentifier } from '../../../src/instruction/enums/method-instruction-identifier';
import { InvalidInstructionReason } from '../../../src/instruction/enums/invalid-instruction-reason';
import { InvalidInstruction } from '../../../src/instruction/instructions/invalid-instruction';
import { BreakInstruction } from '../../../src/instruction/instructions/break-instruction';
import { MergeInstruction } from '../../../src/instruction/instructions/merge-instruction';
import { RepeatInstruction } from '../../../src/instruction/instructions/repeat-instruction';
import { SetSpacingInstruction } from '../../../src/instruction/instructions/set-spacing-instruction';
import { WriteFooterInstruction } from '../../../src/instruction/instructions/write-footer-instruction';
import { WriteHeaderInstruction } from '../../../src/instruction/instructions/write-header-instruction';

const TEST_METHOD_ALIAS = 'testAlias';

describe(`[${InstructionFactory.name}]`, () => {
  describe('[constructor]', () => {
    it('should enable the default method instructions if not specified', () => {
      const factory = new InstructionFactory();

      expect(factory.methodInstructionIdentifiersEnabled).toEqual(
        InstructionFactory.DEFAULT_METHODS_TO_USE
      );
    });

    it('should enable only the given method instructions when specified', () => {
      const methodInstructionsToUse = [
        MethodInstructionIdentifier.Header,
        MethodInstructionIdentifier.Footer,
      ];

      const factory = new InstructionFactory({ useMethods: methodInstructionsToUse });

      expect(factory.methodInstructionIdentifiersEnabled).toEqual(methodInstructionsToUse);
    });
  });

  describe(`[instruction method: ${MethodInstructionIdentifier.Break}]`, () => {
    it('should return a break instruction', () => {
      const factory = new InstructionFactory();

      const instructionData = {
        value: MethodInstructionIdentifier.Break.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Break,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(BreakInstruction);
    });
  });

  describe(`[instruction method: ${MethodInstructionIdentifier.Merge}]`, () => {
    it('should return an invalid instruction when no targets are given', () => {
      const factory = new InstructionFactory();

      const instructionData = {
        value: MethodInstructionIdentifier.Merge.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Merge,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionWithoutTargets
      );
    });

    it('should return an invalid instruction when there are unmergeable instructions given as targets', () => {
      const factory = new InstructionFactory();

      const targetData = {
        value: MethodInstructionIdentifier.Break.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Break,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instructionData = {
        value: `${MethodInstructionIdentifier.Merge.toLowerCase()} { ${targetData.value} }`,
        method: {
          args: [],
          targets: [targetData],
          identifier: MethodInstructionIdentifier.Merge,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionWithUnmergeableTargets
      );
    });

    it('should return an invalid instruction when there are invalid mergeable instructions given as targets', () => {
      const factory = new InstructionFactory();

      const targetData = { value: 'unknown', method: null };

      const instructionData = {
        value: `${MethodInstructionIdentifier.Merge.toLowerCase()} { ${targetData.value} }`,
        method: {
          args: [],
          targets: [targetData],
          identifier: MethodInstructionIdentifier.Merge,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const targetInstruction = factory.getInstruction(targetData);
      const instruction = factory.getInstruction(instructionData);

      expect(targetInstruction).toBeInstanceOf(InvalidInstruction);
      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        (targetInstruction as InvalidInstruction).reasonIdentifier
      );
    });

    it('should return an invalid instruction when there are multiple mergeable instructions applied to the same strings given as targets', () => {
      const factory = new InstructionFactory();

      const targetData = { value: '1-0', method: null };
      const targetsData = [targetData, targetData];

      const instructionData = {
        value: `${MethodInstructionIdentifier.Merge.toLowerCase()} { ${targetsData
          .map((targetData) => targetData.value)
          .join(' ')} }`,
        method: {
          args: [],
          targets: targetsData,
          identifier: MethodInstructionIdentifier.Merge,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes
      );
    });

    it('should return a merge instruction when the targets are valid and mergeable instructions', () => {
      const factory = new InstructionFactory();

      const targetData = { value: '1-0', method: null };

      const instructionData = {
        value: `${MethodInstructionIdentifier.Merge.toLowerCase()} { ${targetData.value} }`,
        method: {
          args: [],
          targets: [targetData],
          identifier: MethodInstructionIdentifier.Merge,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const targetInstruction = factory.getInstruction(targetData);
      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(MergeInstruction);
      expect((instruction as MergeInstruction).instructions).toEqual([targetInstruction]);
    });
  });

  describe(`[instruction method: ${MethodInstructionIdentifier.Repeat}]`, () => {
    it('should return an invalid instruction when no arguments are given', () => {
      const factory = new InstructionFactory();

      const instructionData = {
        value: MethodInstructionIdentifier.Repeat.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Repeat,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction when more than 1 argument is given', () => {
      const factory = new InstructionFactory();

      const args = ['arg1', 'arg2'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Repeat.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Repeat,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction when the given argument is not a number', () => {
      const factory = new InstructionFactory();

      const args = ['arg1'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Repeat.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Repeat,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType
      );
    });

    it('should return an invalid instruction when the given argument value is a number smaller than 1', () => {
      const factory = new InstructionFactory();

      const args = ['0'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Repeat.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Repeat,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue
      );
    });

    it('should return an invalid instruction when no targets are given', () => {
      const factory = new InstructionFactory();

      const args = ['1'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Repeat.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Repeat,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithoutTargets
      );
    });

    it('should return a repeat instruction when targets are given and the number of repetitions is valid', () => {
      const factory = new InstructionFactory();

      const repetitions = 2;
      const args = [repetitions.toString()];
      const targetData = {
        value: '1-0',
        method: null,
      };
      const instructionData = {
        value: `${MethodInstructionIdentifier.Repeat.toLowerCase()} (${args.join(', ')}) {${
          targetData.value
        }}`,
        method: {
          args: args,
          targets: [targetData],
          identifier: MethodInstructionIdentifier.Repeat,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const targetInstruction = factory.getInstruction(targetData);
      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(RepeatInstruction);
      expect((instruction as RepeatInstruction).repetitions).toBe(repetitions);
      expect((instruction as RepeatInstruction).instructions).toEqual([targetInstruction]);
    });
  });

  describe(`[instruction method: ${MethodInstructionIdentifier.Spacing}]`, () => {
    it('should return an invalid instruction when no arguments are given', () => {
      const factory = new InstructionFactory();

      const instructionData = {
        value: MethodInstructionIdentifier.Spacing.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Spacing,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction when more than 1 argument is given', () => {
      const factory = new InstructionFactory();

      const args = ['arg1', 'arg2'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Spacing.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Spacing,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction when the given argument is not a number', () => {
      const factory = new InstructionFactory();

      const args = ['arg1'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Spacing.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Spacing,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValueType
      );
    });

    it('should return an invalid instruction when the given argument value is a number smaller than 1', () => {
      const factory = new InstructionFactory();

      const args = ['0'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Spacing.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Spacing,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValue
      );
    });

    it('should return a set spacing instruction when the spacing value is valid', () => {
      const factory = new InstructionFactory();

      const spacing = 2;
      const args = [spacing.toString()];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Spacing.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Spacing,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(SetSpacingInstruction);
      expect((instruction as SetSpacingInstruction).spacing).toBe(spacing);
    });
  });

  describe(`[instruction method: ${MethodInstructionIdentifier.Footer}]`, () => {
    it('should return an invalid instruction when no arguments are given', () => {
      const factory = new InstructionFactory();

      const instructionData = {
        value: MethodInstructionIdentifier.Footer.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Footer,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.FooterInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction when more than 1 argument is given', () => {
      const factory = new InstructionFactory();

      const args = ['arg1', 'arg2'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Footer.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Footer,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.FooterInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction when the given argument is an empty string', () => {
      const factory = new InstructionFactory();

      const args = ['   '];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Footer.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Footer,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.FooterInstructionWithInvalidFooter
      );
    });

    it('should return a write footer instruction when the footer is valid', () => {
      const factory = new InstructionFactory();

      const footer = 'test footer';
      const args = [footer];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Footer.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Footer,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(WriteFooterInstruction);
      expect((instruction as WriteFooterInstruction).footer).toBe(footer);
    });
  });

  describe(`[instruction method: ${MethodInstructionIdentifier.Header}]`, () => {
    it('should return an invalid instruction when no arguments are given', () => {
      const factory = new InstructionFactory();

      const instructionData = {
        value: MethodInstructionIdentifier.Header.toLowerCase(),
        method: {
          args: [],
          targets: [],
          identifier: MethodInstructionIdentifier.Header,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.HeaderInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction when more than 1 argument is given', () => {
      const factory = new InstructionFactory();

      const args = ['arg1', 'arg2'];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Header.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Header,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.HeaderInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction when the given argument is an empty string', () => {
      const factory = new InstructionFactory();

      const args = ['   '];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Header.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Header,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(InvalidInstruction);
      expect((instruction as InvalidInstruction).reasonIdentifier).toBe(
        InvalidInstructionReason.HeaderInstructionWithInvalidHeader
      );
    });

    it('should return a write header instruction when the header is valid', () => {
      const factory = new InstructionFactory();

      const header = 'test header';
      const args = [header];
      const instructionData = {
        value: `${MethodInstructionIdentifier.Header.toLowerCase()} (${args.join(', ')})`,
        method: {
          args: args,
          targets: [],
          identifier: MethodInstructionIdentifier.Header,
          alias: TEST_METHOD_ALIAS,
        },
      };

      const instruction = factory.getInstruction(instructionData);

      expect(instruction).toBeInstanceOf(WriteHeaderInstruction);
      expect((instruction as WriteHeaderInstruction).header).toBe(header);
    });
  });
});
