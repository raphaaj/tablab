export type InstructionWriteResultData = {
  /**
   * A message that describes the reason for the writing operation to have failed.
   */
  failureMessage?: string | null;

  /**
   * A token that identifies the reason for the writing operation to have failed.
   */
  failureReasonIdentifier: string | null;
};

export abstract class InstructionWriteResult {
  /**
   * A message that describes the reason for the writing operation to have failed.
   */
  failureMessage: string | null;

  /**
   * A token that identifies the reason for the writing operation to have failed.
   */
  failureReasonIdentifier: string | null;

  /**
   * Indicates whether the writing operation has succeeded or not.
   */
  success: boolean;

  /**
   * Creates an instruction writing result.
   * @param writingResultData - The data that describes the writing operation
   * result. The `failureReasonIdentifier` value will be used to determine
   * whether the writing operation has succeeded or not.
   *
   * @see {@link InstructionWriteResult.success}
   */
  constructor(writingResultData: InstructionWriteResultData) {
    const { failureReasonIdentifier, failureMessage } = writingResultData;

    this.failureReasonIdentifier = failureReasonIdentifier || null;
    this.failureMessage = failureMessage || null;
    this.success = this.failureReasonIdentifier === null;
  }
}

export class SuccessInstructionWriteResult extends InstructionWriteResult {
  /**
   * Creates an instruction writing result that indicates a successfully
   * written instruction.
   */
  constructor() {
    super({ failureReasonIdentifier: null });
  }
}

export class FailedInstructionWriteResult extends InstructionWriteResult {
  /**
   * Creates an instruction writing result that indicates a failed
   * written instruction.
   * @param writeResultData - The data that describes the reason for
   * the write operation to have failed.
   */
  constructor(writeResultData: InstructionWriteResultData) {
    super(writeResultData);
  }
}
