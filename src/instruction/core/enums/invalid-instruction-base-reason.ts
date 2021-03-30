export enum InvalidInstructionBaseReason {
  UnmappedReason = 'UNMAPPED_REASON',
  MethodInstructionWithoutIdentifier = 'METHOD_INSTRUCTION_WITHOUT_IDENTIFIER',
  MethodInstructionWithUnmappedIdentifier = 'METHOD_INSTRUCTION_WITH_UNMAPPED_IDENTIFIER',
  WriteNoteInstructionInvalid = 'INVALID_WRITE_NOTE_INSTRUCTION',
  WriteNoteInstructionWithNonWritableNote = 'WRITE_NOTE_INSTRUCTION_WITH_NON_WRITABLE_NOTE',
}

export const InvalidInstructionBaseReasonDescription: Record<
  InvalidInstructionBaseReason,
  string
> = {
  [InvalidInstructionBaseReason.UnmappedReason]: 'Unable to process instruction',
  [InvalidInstructionBaseReason.MethodInstructionWithoutIdentifier]: 'Unknown method',
  [InvalidInstructionBaseReason.MethodInstructionWithUnmappedIdentifier]: 'Unknown method',
  [InvalidInstructionBaseReason.WriteNoteInstructionInvalid]: 'Invalid instruction',
  [InvalidInstructionBaseReason.WriteNoteInstructionWithNonWritableNote]:
    'String value must be between 1 and {0}',
};
