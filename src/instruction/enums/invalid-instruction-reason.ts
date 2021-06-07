export enum InvalidInstructionReason {
  UnknownReason = 'UNKNOWN_REASON',
  BasicInstructionInvalid = 'BASIC_INSTRUCTION_INVALID',
  BasicInstructionWithNonWritableNote = 'BASIC_INSTRUCTION_WITH_NON_WRITABLE_NOTE',
  UnidentifiedMethodInstruction = 'UNIDENTIFIED_METHOD_INSTRUCTION',
  UnknownMethodInstruction = 'UNKNOWN_METHOD_INSTRUCTION',
  HeaderInstructionWithoutArguments = 'HEADER_INSTRUCTION_WITHOUT_ARGUMENTS',
  HeaderInstructionWithUnmappedArguments = 'HEADER_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  HeaderInstructionWithInvalidHeader = 'HEADER_INSTRUCTION_WITH_INVALID_HEADER',
  FooterInstructionWithoutArguments = 'FOOTER_INSTRUCTION_WITHOUT_ARGUMENTS',
  FooterInstructionWithUnmappedArguments = 'FOOTER_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  FooterInstructionWithInvalidFooter = 'FOOTER_INSTRUCTION_WITH_INVALID_FOOTER',
  SpacingInstructionWithoutArguments = 'SPACING_INSTRUCTION_WITHOUT_ARGUMENTS',
  SpacingInstructionWithUnmappedArguments = 'SPACING_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  SpacingInstructionWithInvalidSpacingValueType = 'SPACING_INSTRUCTION_WITH_INVALID_SPACING_VALUE_TYPE',
  SpacingInstructionWithInvalidSpacingValue = 'SPACING_INSTRUCTION_WITH_INVALID_SPACING_VALUE',
  RepeatInstructionWithoutArguments = 'REPEAT_INSTRUCTION_WITHOUT_ARGUMENTS',
  RepeatInstructionWithUnmappedArguments = 'REPEAT_INSTRUCTION_WITH_UNMAPPED_ARGUMENTS',
  RepeatInstructionWithInvalidRepetitionsValueType = 'REPEAT_INSTRUCTION_WITH_INVALID_REPETITIONS_VALUE_TYPE',
  RepeatInstructionWithInvalidRepetitionsValue = 'REPEAT_INSTRUCTION_WITH_INVALID_REPETITIONS_VALUE',
  RepeatInstructionWithoutTargets = 'REPEAT_INSTRUCTION_WITHOUT_TARGETS',
  MergeInstructionWithoutTargets = 'MERGE_INSTRUCTION_WITHOUT_TARGETS',
  MergeInstructionWithUnmergeableTargets = 'MERGE_INSTRUCTION_WITH_UNMERGEABLE_TARGETS',
  MergeInstructionTargetsWithNonWritableNotes = 'MERGE_INSTRUCTION_TARGETS_WITH_NON_WRITABLE_NOTES',
  MergeInstructionTargetsWithConcurrentNotes = 'MERGE_INSTRUCTION_TARGETS_WITH_CONCURRENT_NOTES',
}

export const InvalidInstructionReasonDescription: Record<InvalidInstructionReason, string> = {
  [InvalidInstructionReason.UnknownReason]: 'An unexpected error occurred: {0}',
  [InvalidInstructionReason.BasicInstructionInvalid]: 'Invalid basic instruction',
  [InvalidInstructionReason.BasicInstructionWithNonWritableNote]:
    'String value must be between 1 and {0}',
  [InvalidInstructionReason.UnidentifiedMethodInstruction]:
    'Unidentified method instruction for alias "{0}"',
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
  [InvalidInstructionReason.MergeInstructionTargetsWithNonWritableNotes]:
    'Identified target instructions with strings out of tab range. String value must be between 1 and {0}',
  [InvalidInstructionReason.MergeInstructionTargetsWithConcurrentNotes]:
    'Identified multiple target instructions applied to the same string',
};
