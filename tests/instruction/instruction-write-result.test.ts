import {
  FailedInstructionWriteResult,
  SuccessInstructionWriteResult,
} from '../../src/instruction/instruction-write-result';

describe(`[${SuccessInstructionWriteResult.name}]`, () => {
  it('should have the success property set to true', () => {
    const successResult = new SuccessInstructionWriteResult();

    expect(successResult.success).toBe(true);
  });

  it('should set the failureReasonIdentifier to null', () => {
    const successResult = new SuccessInstructionWriteResult();

    expect(successResult.failureReasonIdentifier).toBe(null);
  });
});

describe(`[${FailedInstructionWriteResult.name}]`, () => {
  it('should have the success property set to false', () => {
    const failureReasonIdentifier = 'TEST_REASON';

    const failedResult = new FailedInstructionWriteResult({
      failureReasonIdentifier,
    });

    expect(failedResult.success).toBe(false);
  });

  it('should set the failureReasonIdentifier to the given identifier', () => {
    const failureReasonIdentifier = 'TEST_REASON';

    const failedResult = new FailedInstructionWriteResult({
      failureReasonIdentifier,
    });

    expect(failedResult.failureReasonIdentifier).toBe(failureReasonIdentifier);
  });

  it('should set the failureMessage to null if none is provided', () => {
    const failureReasonIdentifier = 'TEST_REASON';

    const failedResult = new FailedInstructionWriteResult({
      failureReasonIdentifier,
    });

    expect(failedResult.failureMessage).toBe(null);
  });

  it('should set the failureMessage to the given message if one is provided', () => {
    const failureReasonIdentifier = 'TEST_REASON';
    const failureMessage = 'Test Message';

    const failedResult = new FailedInstructionWriteResult({
      failureReasonIdentifier,
      failureMessage,
    });

    expect(failedResult.failureMessage).toBe(failureMessage);
  });
});
