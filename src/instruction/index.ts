export { MethodInstructionIdentifier } from './enums/method-instruction-identifier';
export { InvalidInstructionReason } from './enums/invalid-instruction-reason';

export {
  InstructionData,
  InstructionProvider,
  MethodInstructionData,
  MethodInstructionBuilder,
  InstructionFactoryBase,
  ArgumentsMinNumberValidation,
  ArgumentsMaxNumberValidation,
  ArgumentsValidation,
  ArgumentNumberMinValueValidation,
  ArgumentNumberMaxValueValidation,
  ArgumentNumberValidation,
  TargetsMinNumberValidation,
  TargetsMaxNumberValidation,
  TargetsValidation,
} from './factories/instruction-factory-base';
export { InstructionFactoryOptions, InstructionFactory } from './factories/instruction-factory';
export {
  InvalidInstructionDescriptionFactory,
  GetInvalidInstructionDescriptionData,
} from './factories/invalid-instruction-description-factory';

export { Instruction } from './instructions/instruction';
export { MergeableInstruction } from './instructions/mergeable-instruction';
export { InvalidInstruction } from './instructions/invalid-instruction';
export { WriteNoteInstruction } from './instructions/write-note-instruction';
export { BreakInstruction } from './instructions/break-instruction';
export { MergeInstruction } from './instructions/merge-instruction';
export { RepeatInstruction } from './instructions/repeat-instruction';
export { SetSpacingInstruction } from './instructions/set-spacing-instruction';
export { WriteFooterInstruction } from './instructions/write-footer-instruction';
export { WriteHeaderInstruction } from './instructions/write-header-instruction';

export {
  InvalidInstructionDescriptionTemplateProvider,
  InvalidInstructionDescriptionTemplate,
  InvalidInstructionDescriptionFunctionTemplateParams,
} from './providers/invalid-instruction-description-template-provider';
export { InternalInvalidInstructionDescriptionTemplateProvider } from './providers/internal-invalid-instruction-description-template-provider';

export {
  InstructionWriteResultData,
  InstructionWriteResult,
  SuccessInstructionWriteResult,
  FailedInstructionWriteResult,
} from './instruction-write-result';
