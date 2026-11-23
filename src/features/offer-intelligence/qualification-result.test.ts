import { describe, expect, it } from 'vitest';
import { qualificationResultSchema } from './qualification-result';

describe('qualificationResultSchema', () => {
  const validResult = {
    score: 72,
    rationale: 'The company matches the reviewed service profile.',
    evidence: [
      {
        evidenceId: '4b5c2d5a-8ed4-4db4-b0e7-f0226f82df42',
        claim: 'The company provides software development services.',
      },
    ],
  };

  it('accepts an in-range score with at least one traceable evidence item', () => {
    expect(qualificationResultSchema.safeParse(validResult).success).toBe(true);
  });

  it('rejects scores outside the defined range', () => {
    expect(
      qualificationResultSchema.safeParse({ ...validResult, score: 101 })
        .success,
    ).toBe(false);
  });

  it('rejects a score without evidence', () => {
    expect(
      qualificationResultSchema.safeParse({ ...validResult, evidence: [] })
        .success,
    ).toBe(false);
  });
});
