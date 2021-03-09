export type InstructionWriteResultData = {
  failureMessage?: string | null;
  failureReasonIdentifier: string | null;
};

export abstract class InstructionWriteResult {
  get success(): boolean {
    return this.failureReasonIdentifier === null;
  }

  failureMessage: string | null;
  failureReasonIdentifier: string | null;

  constructor({
    failureReasonIdentifier: failureReason,
    failureMessage,
  }: InstructionWriteResultData) {
    this.failureReasonIdentifier = failureReason || null;
    this.failureMessage = failureMessage || null;
  }
}

export class SuccessInstructionWriteResult extends InstructionWriteResult {
  constructor() {
    super({ failureReasonIdentifier: null });
  }
}

export class FailedInstructionWriteResult extends InstructionWriteResult {
  constructor(resultData: InstructionWriteResultData) {
    super(resultData);
  }
}
