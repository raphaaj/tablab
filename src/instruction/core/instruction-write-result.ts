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
   * Indicates whether the writing operation has succeeded or not. The writing
   * operation is considered to have been completed successfully if the
   * `failureReasonIdentifier` value is null.
   */
  get success(): boolean {
    return this.failureReasonIdentifier === null;
  }

  /**
   * A message that describes the reason for the writing operation to have failed.
   */
  failureMessage: string | null;

  /**
   * A token that identifies the reason for the writing operation to have failed.
   */
  failureReasonIdentifier: string | null;

  /**
   * Creates an instruction writing result.
   * @param writingResultData - The data that describes the writing operation
   * result. The `failureReasonIdentifier` value will be used to determine
   * whether the writing operation has succeeded or not.
   *
   * @see {@link InstructionWriteResult.success}
   */
  constructor(writingResultData: InstructionWriteResultData) {
    const { failureReasonIdentifier: failureReason, failureMessage } = writingResultData;

    this.failureReasonIdentifier = failureReason || null;
    this.failureMessage = failureMessage || null;
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
