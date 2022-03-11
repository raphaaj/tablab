import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { FailedWriteResultDescriptionTemplateProvider } from './failed-write-result-description-template-provider';

export const internalFailedWriteResultDescriptionTemplateProvider: FailedWriteResultDescriptionTemplateProvider =
  {
    [InvalidInstructionReason.UnknownReason]: 'An unexpected error occurred',
    [InvalidInstructionReason.BasicInstructionInvalid]: 'Invalid basic instruction',
    [InvalidInstructionReason.BasicInstructionWithNonWritableNote]: (data = {}) => {
      if (data.tab) return `String value must be between 1 and ${data.tab.numberOfStrings}`;
      else return 'String value not available on tab';
    },
    [InvalidInstructionReason.UnidentifiedMethodInstruction]: (data = {}) => {
      if (data.parsedInstruction && data.parsedInstruction.method)
        return `No method instruction identified for alias "${data.parsedInstruction.method.alias}"`;
      else return 'No method instruction identified for the given alias';
    },
    [InvalidInstructionReason.UnknownMethodInstruction]: (data = {}) => {
      if (data.parsedInstruction && data.parsedInstruction.method)
        return `Method instruction not implemented for alias "${data.parsedInstruction.method.alias}"`;
      else return 'Method instruction not implemented for the given alias';
    },
    [InvalidInstructionReason.HeaderInstructionWithInvalidHeader]:
      'The header message should be a string with at least one character other than a whitespace',
    [InvalidInstructionReason.HeaderInstructionWithUnmappedArguments]:
      'The header method requires only one argument: the header message',
    [InvalidInstructionReason.HeaderInstructionWithoutArguments]:
      'The header method requires one argument: the header message',
    [InvalidInstructionReason.FooterInstructionWithInvalidFooter]:
      'The footer message should be a string with at least one character other than a whitespace',
    [InvalidInstructionReason.FooterInstructionWithUnmappedArguments]:
      'The footer method requires only one argument: the footer message',
    [InvalidInstructionReason.FooterInstructionWithoutArguments]:
      'The footer method requires one argument: the footer message',
    [InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValueType]:
      'The spacing value must be an integer number',
    [InvalidInstructionReason.SpacingInstructionWithInvalidSpacingValue]:
      'The spacing value must be at least 1',
    [InvalidInstructionReason.SpacingInstructionWithUnmappedArguments]:
      'The spacing method requires only one argument: the new spacing value',
    [InvalidInstructionReason.SpacingInstructionWithoutArguments]:
      'The spacing method requires one argument: the new spacing value',
    [InvalidInstructionReason.RepeatInstructionWithoutArguments]:
      'The repeat method requires one argument: the number of repetitions',
    [InvalidInstructionReason.RepeatInstructionWithUnmappedArguments]:
      'The repeat method requires only one argument: the number of repetitions',
    [InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType]:
      'The repetitions value must be an integer number',
    [InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue]:
      'The repetitions value must be at least 1',
    [InvalidInstructionReason.RepeatInstructionWithoutTargets]:
      'The repeat method requires at least one target instruction to repeat',
    [InvalidInstructionReason.MergeInstructionWithoutTargets]:
      'The merge method requires at least two target instructions to merge',
    [InvalidInstructionReason.MergeInstructionWithUnmergeableTargets]:
      'The targets of the merge method must not be method instructions',
    [InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes]: (data = {}) => {
      if (data.tab)
        return (
          'Identified target instructions with strings out of tab range. ' +
          `String value must be between 1 and ${data.tab.numberOfStrings}`
        );
      else
        return 'Identified target instructions with strings out of tab range. String not available on tab';
    },
    [InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes]:
      'Identified multiple target instructions applied to the same string',
  };
