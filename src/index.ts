export { Enclosure } from './helpers/enclosures-helper';

export { InvalidInstructionReason } from './instruction-writer/enums/invalid-instruction-reason';
export { MethodInstruction } from './instruction-writer/enums/method-instruction';
export {
  ArgumentNumberMaxValueValidationOptions,
  ArgumentNumberMinValueValidationOptions,
  ArgumentNumberValidationOptions,
  ArgumentsMaxNumberValidationOptions,
  ArgumentsMinNumberValidationOptions,
  ArgumentsValidationOptions,
  BaseInstructionWriterFactory,
  InstructionWriterProvider,
  MethodInstructionWriterBuilder,
  TargetsMaxNumberValidationOptions,
  TargetsMinNumberValidationOptions,
  TargetsValidationOptions,
} from './instruction-writer/factories/base-instruction-writer-factory';
export {
  InternalFailedWriteResultDescriptionFactory,
  InternalFailedWriteResultDescriptionFactoryOptions,
} from './instruction-writer/factories/internal-failed-write-result-description-factory';
export {
  InternalInstructionWriterFactory,
  InternalInstructionWriterFactoryOptions,
} from './instruction-writer/factories/internal-instruction-writer-factory';
export {
  BaseInstructionWriter,
  BaseInstructionWriterOptions,
} from './instruction-writer/instruction-writers/base-instruction-writer';
export {
  BaseInvalidInstructionWriter,
  BaseInvalidInstructionWriterOptions,
} from './instruction-writer/instruction-writers/base-invalid-instruction-writer';
export {
  BreakInstructionWriter,
  BreakInstructionWriterOptions,
} from './instruction-writer/instruction-writers/break-instruction-writer';
export {
  FooterInstructionWriter,
  FooterInstructionWriterOptions,
} from './instruction-writer/instruction-writers/footer-instruction-writer';
export {
  HeaderInstructionWriter,
  HeaderInstructionWriterOptions,
} from './instruction-writer/instruction-writers/header-instruction-writer';
export {
  MergeInstructionWriter,
  MergeInstructionWriterOptions,
} from './instruction-writer/instruction-writers/merge-instruction-writer';
export {
  MergeableInstructionWriter,
  MergeableInstructionWriterOptions,
} from './instruction-writer/instruction-writers/mergeable-instruction-writer';
export {
  NoteInstructionWriter,
  NoteInstructionWriterOptions,
} from './instruction-writer/instruction-writers/note-instruction-writer';
export {
  RepeatInstructionWriter,
  RepeatInstructionWriterOptions,
} from './instruction-writer/instruction-writers/repeat-instruction-writer';
export {
  SetSpacingInstructionWriter,
  SetSpacingInstructionWriterOptions,
} from './instruction-writer/instruction-writers/set-spacing-instruction-writer';
export {
  FailedWriteResultDescriptionTemplate,
  FailedWriteResultDescriptionTemplateFunction,
  FailedWriteResultDescriptionTemplateFunctionData,
  FailedWriteResultDescriptionTemplateProvider,
} from './instruction-writer/providers/failed-write-result-description-template-provider';
export {
  BaseWriteResult,
  BaseWriteResultOptions,
} from './instruction-writer/write-results/base-write-result';
export {
  FailedWriteResult,
  FailedWriteResultOptions,
} from './instruction-writer/write-results/failed-write-result';
export {
  SuccessfulWriteResult,
  SuccessfulWriteResultOptions,
} from './instruction-writer/write-results/successful-write-result';

export {
  ParsedInstruction,
  ParsedInstructionData,
  ParsedInstructionOptions,
} from './parser/parsed-instruction';
export {
  MethodTargetExtractionResult,
  ParsedMethodInstruction,
  ParsedMethodInstructionData,
  ParsedMethodInstructionOptions,
} from './parser/parsed-method-instruction';
export { Parser, ParserOptions } from './parser/parser';

export { Note } from './tab/note';
export { Tab } from './tab/tab';
export { TabBlock } from './tab/tab-block';
export { TabElement, TabElementOptions } from './tab/tab-element';
