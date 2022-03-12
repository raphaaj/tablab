import { InvalidInstructionReason } from '../../../src/instruction-writer/enums/invalid-instruction-reason';
import { MethodInstruction } from '../../../src/instruction-writer/enums/method-instruction';
import { InternalInstructionWriterFactory } from '../../../src/instruction-writer/factories/internal-instruction-writer-factory';
import { BaseInvalidInstructionWriter } from '../../../src/instruction-writer/instruction-writers/base-invalid-instruction-writer';
import { BreakInstructionWriter } from '../../../src/instruction-writer/instruction-writers/break-instruction-writer';
import { FooterInstructionWriter } from '../../../src/instruction-writer/instruction-writers/footer-instruction-writer';
import { HeaderInstructionWriter } from '../../../src/instruction-writer/instruction-writers/header-instruction-writer';
import { MergeInstructionWriter } from '../../../src/instruction-writer/instruction-writers/merge-instruction-writer';
import { RepeatInstructionWriter } from '../../../src/instruction-writer/instruction-writers/repeat-instruction-writer';
import { SetSpacingInstructionWriter } from '../../../src/instruction-writer/instruction-writers/set-spacing-instruction-writer';
import { ParsedInstructionData } from '../../../src/parser/parsed-instruction';

describe(`[${InternalInstructionWriterFactory.name}]`, () => {
  describe('[constructor]', () => {
    it('should enable the default method instructions if not specified', () => {
      const factory = new InternalInstructionWriterFactory();

      expect(factory.methodInstructionsEnabled).toEqual(
        InternalInstructionWriterFactory.DEFAULT_METHOD_INSTRUCTIONS_TO_USE
      );
    });

    it('should enable only the given method instructions when specified', () => {
      const methodInstructionsToUse = [MethodInstruction.Header, MethodInstruction.Footer];

      const factory = new InternalInstructionWriterFactory({ methodInstructionsToUse });

      expect(factory.methodInstructionsEnabled).toEqual(methodInstructionsToUse);
    });
  });

  describe(`[instruction method: ${MethodInstruction.Break}]`, () => {
    it('should return a break instruction writer', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const instruction = alias;
      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Break,
          args: [],
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BreakInstructionWriter);
    });
  });

  describe(`[instruction method: ${MethodInstruction.Footer}]`, () => {
    it('should return an invalid instruction writer when no arguments are given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const instruction = alias;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Footer,
          args: [],
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.FooterInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction writer when more than 1 argument is given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['arg1', 'arg2'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Footer,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.FooterInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction writer when the given argument is an empty string', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['   '];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Footer,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.FooterInstructionWithInvalidFooter
      );
    });

    it('should return a footer instruction writer when the footer is valid', () => {
      const factory = new InternalInstructionWriterFactory();

      const footer = 'test footer';

      const alias = 'testAlias';
      const args = [`${footer}`];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Footer,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(FooterInstructionWriter);
      expect((instructionWriter as FooterInstructionWriter).footer).toBe(footer);
    });
  });

  describe(`[instruction method: ${MethodInstruction.Header}]`, () => {
    it('should return an invalid instruction writer when no arguments are given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const instruction = alias;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Header,
          args: [],
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.HeaderInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction writer when more than 1 argument is given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['arg1', 'arg2'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Header,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.HeaderInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction writer when the given argument is an empty string', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['   '];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Header,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.HeaderInstructionWithInvalidHeader
      );
    });

    it('should return a header instruction writer when the header is valid', () => {
      const factory = new InternalInstructionWriterFactory();

      const header = 'test header';

      const alias = 'testAlias';
      const args = [`${header}`];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Header,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(HeaderInstructionWriter);
      expect((instructionWriter as HeaderInstructionWriter).header).toBe(header);
    });
  });

  describe(`[instruction method: ${MethodInstruction.Merge}]`, () => {
    it('should return an invalid instruction writer when no targets are given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const instruction = alias;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Merge,
          args: [],
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionWithoutTargets
      );
    });

    it('should return an invalid instruction writer when there are unmergeable instructions given as targets', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const targets = ['testTargetAlias', 'testTargetAlias'];
      const instruction = `${alias} { ${targets.join(' ')} }`;

      const targetParsedInstructions: ParsedInstructionData[] = targets.map((targetInstruction) => {
        const targetInstructionStartIndexOnInstruction = instruction.indexOf(targetInstruction);

        return {
          method: {
            alias: targetInstruction,
            identifier: MethodInstruction.Break,
            args: [],
            targets: [],
          },
          readFromIndex: targetInstructionStartIndexOnInstruction,
          readToIndex: targetInstructionStartIndexOnInstruction + targetInstruction.length,
          value: targetInstruction,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Merge,
          args: [],
          targets: targetParsedInstructions,
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionWithUnmergeableTargets
      );
    });

    it('should return an invalid instruction writer when there are invalid mergeable instructions given as targets', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const targets = ['unknown', 'unknown'];
      const instruction = `${alias} { ${targets.join(' ')} }`;

      const targetParsedInstructions: ParsedInstructionData[] = targets.map((targetInstruction) => {
        const targetInstructionStartIndexOnInstruction = instruction.indexOf(targetInstruction);

        return {
          method: {
            alias: targetInstruction,
            identifier: null,
            args: [],
            targets: [],
          },
          readFromIndex: targetInstructionStartIndexOnInstruction,
          readToIndex: targetInstructionStartIndexOnInstruction + targetInstruction.length,
          value: targetInstruction,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Merge,
          args: [],
          targets: targetParsedInstructions,
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const firstTargetParsedInstruction = targetParsedInstructions[0];
      const firstTargetInstructionWriter = factory.getInstructionWriter(
        firstTargetParsedInstruction
      );

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(firstTargetInstructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        (firstTargetInstructionWriter as BaseInvalidInstructionWriter).reasonIdentifier
      );
    });

    it('should return an invalid instruction writer when there are multiple mergeable instructions applied to the same strings given as targets', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const targets = ['1-0', '1-0'];
      const instruction = `${alias} { ${targets.join(' ')} }`;

      const targetParsedInstructions: ParsedInstructionData[] = targets.map((targetInstruction) => {
        const targetInstructionStartIndexOnInstruction = instruction.indexOf(targetInstruction);

        return {
          method: null,
          readFromIndex: targetInstructionStartIndexOnInstruction,
          readToIndex: targetInstructionStartIndexOnInstruction + targetInstruction.length,
          value: targetInstruction,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Merge,
          args: [],
          targets: targetParsedInstructions,
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes
      );
    });

    it('should return a merge instruction writer when the targets are valid and mergeable instructions', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const targets = ['1-0', '2-0'];
      const instruction = `${alias} { ${targets.join(' ')} }`;

      const targetParsedInstructions: ParsedInstructionData[] = targets.map((targetInstruction) => {
        const targetInstructionStartIndexOnInstruction = instruction.indexOf(targetInstruction);

        return {
          method: null,
          readFromIndex: targetInstructionStartIndexOnInstruction,
          readToIndex: targetInstructionStartIndexOnInstruction + targetInstruction.length,
          value: targetInstruction,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Merge,
          args: [],
          targets: targetParsedInstructions,
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const targetInstructionWriters = targetParsedInstructions.map((targetParsedInstruction) =>
        factory.getInstructionWriter(targetParsedInstruction)
      );

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(MergeInstructionWriter);
      expect((instructionWriter as MergeInstructionWriter).instructionWritersToMerge).toEqual(
        targetInstructionWriters
      );
    });
  });

  describe(`[instruction method: ${MethodInstruction.Repeat}]`, () => {
    it('should return an invalid instruction writer when no arguments are given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const instruction = alias;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args: [],
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction writer when more than 1 argument is given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['arg1', 'arg2'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction writer when the given argument is not a number', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['arg1'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType
      );
    });

    it('should return an invalid instruction writer when the given argument value is a number smaller than 1', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['0'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue
      );
    });

    it('should return an invalid instruction writer when the given argument value is not an integer', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['3.14'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType
      );
    });

    it('should return an invalid instruction writer when no targets are given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['1'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.RepeatInstructionWithoutTargets
      );
    });

    it('should return a repeat instruction writer when targets are given and the number of repetitions is valid', () => {
      const factory = new InternalInstructionWriterFactory();

      const numberOfRepetitions = 2;

      const alias = 'testAlias';
      const args = [`${numberOfRepetitions}`];
      const targets = ['1-0'];
      const instruction = `${alias} ( ${args.join(', ')} ) { ${targets.join(' ')} }`;

      const targetParsedInstructions: ParsedInstructionData[] = targets.map((targetInstruction) => {
        const targetInstructionStartIndexOnInstruction = instruction.indexOf(targetInstruction);

        return {
          method: null,
          readFromIndex: targetInstructionStartIndexOnInstruction,
          readToIndex: targetInstructionStartIndexOnInstruction + targetInstruction.length,
          value: targetInstruction,
        };
      });

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.Repeat,
          args,
          targets: targetParsedInstructions,
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const targetInstructionWriters = targetParsedInstructions.map((targetParsedInstruction) =>
        factory.getInstructionWriter(targetParsedInstruction)
      );

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(RepeatInstructionWriter);
      expect((instructionWriter as RepeatInstructionWriter).numberOfRepetitions).toBe(
        numberOfRepetitions
      );
      expect((instructionWriter as RepeatInstructionWriter).instructionWritersToRepeat).toEqual(
        targetInstructionWriters
      );
    });
  });

  describe(`[instruction method: ${MethodInstruction.SetSpacing}]`, () => {
    it('should return an invalid instruction writer when no arguments are given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const instruction = alias;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.SetSpacing,
          args: [],
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithoutArguments
      );
    });

    it('should return an invalid instruction writer when more than 1 argument is given', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['arg1', 'arg2'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.SetSpacing,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithUnmappedArguments
      );
    });

    it('should return an invalid instruction writer when the given argument is not a number', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['arg1'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.SetSpacing,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValueType
      );
    });

    it('should return an invalid instruction writer when the given argument value is a number smaller than 1', () => {
      const factory = new InternalInstructionWriterFactory();

      const alias = 'testAlias';
      const args = ['0'];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.SetSpacing,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(BaseInvalidInstructionWriter);
      expect((instructionWriter as BaseInvalidInstructionWriter).reasonIdentifier).toBe(
        InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValue
      );
    });

    it('should return a set spacing instruction writer when the spacing value is valid', () => {
      const factory = new InternalInstructionWriterFactory();

      const spacing = 2;

      const alias = 'testAlias';
      const args = [`${spacing}`];
      const instruction = `${alias} ( ${args.join(', ')} )`;

      const parsedInstruction: ParsedInstructionData = {
        method: {
          alias,
          identifier: MethodInstruction.SetSpacing,
          args,
          targets: [],
        },
        readFromIndex: 0,
        readToIndex: instruction.length,
        value: instruction,
      };

      const instructionWriter = factory.getInstructionWriter(parsedInstruction);

      expect(instructionWriter).toBeInstanceOf(SetSpacingInstructionWriter);
      expect((instructionWriter as SetSpacingInstructionWriter).spacing).toBe(spacing);
    });
  });

  describe('[edge case validations]', () => {
    it.each([
      [MethodInstruction.Footer, 'buildFooterInstructionWriter'],
      [MethodInstruction.Header, 'buildHeaderInstructionWriter'],
      [MethodInstruction.Merge, 'buildMergeInstructionWriter'],
      [MethodInstruction.Repeat, 'buildRepeatInstructionWriter'],
      [MethodInstruction.SetSpacing, 'buildSetSpacingInstructionWriter'],
    ])(
      'should throw if it tries to get an instruction writer from a non method parsed instruction (%s, %s)',
      (methodInstructionIdentifier, instructionWriterBuilder) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const factoryPrototype = InternalInstructionWriterFactory.prototype as any;
        const oldInstructionWriterBuilder = factoryPrototype[instructionWriterBuilder];
        const buildInstructionWriterSpy = jest
          .spyOn(factoryPrototype, instructionWriterBuilder)
          .mockImplementationOnce((parsedInstruction) => {
            (parsedInstruction as ParsedInstructionData).method = null;
            return oldInstructionWriterBuilder(parsedInstruction);
          });

        const factory = new InternalInstructionWriterFactory();

        const alias = 'testAlias';
        const instruction = alias;

        const parsedInstruction: ParsedInstructionData = {
          method: {
            alias,
            identifier: methodInstructionIdentifier,
            args: [],
            targets: [],
          },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        expect(() => factory.getInstructionWriter(parsedInstruction)).toThrow();
        expect(buildInstructionWriterSpy).toHaveBeenCalled();

        buildInstructionWriterSpy.mockRestore();
      }
    );

    it.each([
      [MethodInstruction.Footer, '_validateFooterInstructionArguments'],
      [MethodInstruction.Header, '_validateHeaderInstructionArguments'],
      [MethodInstruction.Repeat, '_validateRepeatInstructionArguments'],
      [MethodInstruction.SetSpacing, '_validateSetSpacingInstructionArguments'],
    ])(
      'should throw if it tries to validate the arguments of a method instruction from a non method parsed instruction (%s, %s)',
      (methodInstructionIdentifier, methodInstructionArgumentsValidation) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const factoryPrototype = InternalInstructionWriterFactory.prototype as any;
        const oldMethodInstructionArgumentsValidation =
          factoryPrototype[methodInstructionArgumentsValidation];
        const methodInstructionArgumentsValidationSpy = jest
          .spyOn(factoryPrototype, methodInstructionArgumentsValidation)
          .mockImplementationOnce((parsedInstruction) => {
            (parsedInstruction as ParsedInstructionData).method = null;
            return oldMethodInstructionArgumentsValidation(parsedInstruction);
          });

        const factory = new InternalInstructionWriterFactory();

        const alias = 'testAlias';
        const instruction = alias;

        const parsedInstruction: ParsedInstructionData = {
          method: {
            alias,
            identifier: methodInstructionIdentifier,
            args: [],
            targets: [],
          },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        expect(() => factory.getInstructionWriter(parsedInstruction)).toThrow();
        expect(methodInstructionArgumentsValidationSpy).toHaveBeenCalled();

        methodInstructionArgumentsValidationSpy.mockRestore();
      }
    );

    it.each([
      [MethodInstruction.Merge, '_validateMergeInstructionTargets', []],
      [MethodInstruction.Repeat, '_validateRepeatInstructionTargets', ['1']],
    ])(
      'should throw if it tries to validate the targets of a method instruction from a non method parsed instruction (%s, %s)',
      (methodInstructionIdentifier, methodInstructionTargetsValidation, methodInstructionArgs) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const factoryPrototype = InternalInstructionWriterFactory.prototype as any;
        const oldMethodInstructionTargetsValidation =
          factoryPrototype[methodInstructionTargetsValidation];
        const methodInstructionTargetsValidationSpy = jest
          .spyOn(factoryPrototype, methodInstructionTargetsValidation)
          .mockImplementationOnce((parsedInstruction) => {
            (parsedInstruction as ParsedInstructionData).method = null;
            return oldMethodInstructionTargetsValidation(parsedInstruction);
          });

        const factory = new InternalInstructionWriterFactory();

        const alias = 'testAlias';
        const instruction = alias;

        const parsedInstruction: ParsedInstructionData = {
          method: {
            alias,
            identifier: methodInstructionIdentifier,
            args: methodInstructionArgs,
            targets: [],
          },
          readFromIndex: 0,
          readToIndex: instruction.length,
          value: instruction,
        };

        expect(() => factory.getInstructionWriter(parsedInstruction)).toThrow();
        expect(methodInstructionTargetsValidationSpy).toHaveBeenCalled();

        methodInstructionTargetsValidationSpy.mockRestore();
      }
    );
  });
});
