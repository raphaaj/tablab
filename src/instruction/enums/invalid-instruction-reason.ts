export enum InvalidInstructionReason {
  UnmappedReason = 'UNMAPPED_REASON',
  WriteHeaderInstructionWithoutArguments = 'WRITE_HEADER_INSTRUCTION_WITHOUT_ARGUMENTS',
  WriteHeaderInstructionWithUnmappedArguments = 'WRITE_HEADER_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  WriteHeaderInstructionWithInvalidHeader = 'WRITE_HEADER_INSTRUCTION_WITH_INVALID_HEADER',
  WriteFooterInstructionWithoutArguments = 'WRITE_FOOTER_INSTRUCTION_WITHOUT_ARGUMENTS',
  WriteFooterInstructionWithUnmappedArguments = 'WRITE_FOOTER_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  WriteFooterInstructionWithInvalidFooter = 'WRITE_FOOTER_INSTRUCTION_WITH_INVALID_FOOTER',
  SetSpacingInstructionWithoutArguments = 'SET_SPACING_INSTRUCTION_WITHOUT_ARGUMENTS',
  SetSpacingInstructionWithUnmappedArguments = 'SET_SPACING_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  SetSpacingInstructionWithInvalidSpacingValueType = 'SET_SPACING_INSTRUCTION_WITH_INVALID_SPACING_VALUE_TYPE',
  SetSpacingInstructionWithInvalidSpacingValue = 'SET_SPACING_INSTRUCTION_WITH_INVALID_SPACING_VALUE',
  RepeatInstructionWithoutArguments = 'REPEAT_INSTRUCTION_WITHOUT_ARGUMENTS',
  RepeatInstructionWithUnmappedArguments = 'REPEAT_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  RepeatInstructionWithInvalidRepetitionsValueType = 'REPEAT_INSTRUCTION_WITH_INVALID_REPETITIONS_VALUE_TYPE',
  RepeatInstructionWithInvalidRepetitionsValue = 'REPEAT_INSTRUCTION_WITH_INVALID_REPETITIONS_VALUE',
  RepeatInstructionWithoutTargets = 'REPEAT_INSTRUCTION_WITHOUT_TARGETS',
  MergeInstructionWithoutTargets = 'MERGE_INSTRUCTION_WITHOUT_TARGETS',
  MergeInstructionWithUnmergeableTargets = 'MERGE_INSTRUCTION_WITH_UNMERGEABLE_TARGETS',
  MergeInstructionTargetsWithStringOutOfTabRange = 'MERGE_INSTRUCTION_TARGETS_WITH_STRINGS_OUT_OF_TAB_RANGE',
  MergeInstructionTargetsWithConcurrentNotes = 'MERGE_INSTRUCTION_TARGETS_WITH_CONCURRENT_NOTES',
}

export const InvalidInstructionReasonDescription: Record<InvalidInstructionReason, string> = {
  [InvalidInstructionReason.UnmappedReason]: 'Unable to process instruction',
  [InvalidInstructionReason.WriteHeaderInstructionWithInvalidHeader]:
    'The header value should be a string with at least one character other than a whitespace',
  [InvalidInstructionReason.WriteHeaderInstructionWithUnmappedArguments]:
    'The header method requires only one argument: the header value',
  [InvalidInstructionReason.WriteHeaderInstructionWithoutArguments]:
    'The header method requires one argument: the header value',
  [InvalidInstructionReason.WriteFooterInstructionWithInvalidFooter]:
    'The footer value should be a string with at least one character other than a whitespace',
  [InvalidInstructionReason.WriteFooterInstructionWithUnmappedArguments]:
    'The footer method requires only one argument: the footer value',
  [InvalidInstructionReason.WriteFooterInstructionWithoutArguments]:
    'The footer method requires one argument: the footer value',
  [InvalidInstructionReason.SetSpacingInstructionWithInvalidSpacingValueType]:
    'The spacing value must be an integer number',
  [InvalidInstructionReason.SetSpacingInstructionWithInvalidSpacingValue]:
    'The spacing value must be at least 1',
  [InvalidInstructionReason.SetSpacingInstructionWithUnmappedArguments]:
    'The set spacing method requires only one argument: the new spacing value',
  [InvalidInstructionReason.SetSpacingInstructionWithoutArguments]:
    'The set spacing method requires one argument: the new spacing value',
  [InvalidInstructionReason.RepeatInstructionWithoutArguments]:
    'The repeat method requires one argument: the number of repetitions',
  [InvalidInstructionReason.RepeatInstructionWithUnmappedArguments]:
    'The repeat method requires only one argument: the number of repetitions',
  [InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValueType]:
    'The repetitions value must be an integer number',
  [InvalidInstructionReason.RepeatInstructionWithInvalidRepetitionsValue]:
    'The repetitions value must be at least 1',
  [InvalidInstructionReason.RepeatInstructionWithoutTargets]:
    'The repeat method requires at least one target instruction',
  [InvalidInstructionReason.MergeInstructionWithoutTargets]:
    'The merge method requires at least one target instruction',
  [InvalidInstructionReason.MergeInstructionWithUnmergeableTargets]:
    'The targets of the merge method must not be method instructions',
  [InvalidInstructionReason.MergeInstructionTargetsWithStringOutOfTabRange]:
    'Identified target instructions with string out of tab range. String value must be between 1 and {0}',
  [InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes]:
    'Identified multiple target instructions applied to the same string',
};
