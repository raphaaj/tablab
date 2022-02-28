import { InvalidInstructionReason } from '../enums/invalid-instruction-reason';
import { InvalidInstructionDescriptionTemplateProvider } from './invalid-instruction-description-template-provider';

export const InternalInvalidInstructionDescriptionTemplateProvider: InvalidInstructionDescriptionTemplateProvider<InvalidInstructionReason> =
  {
    [InvalidInstructionReason.UnknownReason]: 'An unexpected error occurred',
    [InvalidInstructionReason.BasicInstructionInvalid]: 'Invalid basic instruction',
    [InvalidInstructionReason.BasicInstructionWithNonWritableNote]: (data = {}) => {
      if (data.tab) return `String value must be between 1 and ${data.tab.numberOfStrings}`;
      else return 'String not available on tab';
    },
    [InvalidInstructionReason.UnidentifiedMethodInstruction]: (data = {}) => {
      if (data.methodInstructionData)
        return `Unidentified method instruction for alias "${data.methodInstructionData.alias}"`;
      else return 'No method instruction identified under the given alias';
    },
    [InvalidInstructionReason.UnknownMethodInstruction]: 'Unknown method instruction',
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
      'The merge method requires at least one target instruction to merge',
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
