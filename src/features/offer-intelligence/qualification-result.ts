import { z } from 'zod';

export const qualificationResultSchema = z.object({
  score: z.number().int().min(0).max(100),
  rationale: z.string().trim().min(1).max(2_000),
  evidence: z
    .array(
      z.object({
        evidenceId: z.uuid(),
        claim: z.string().trim().min(1).max(500),
      }),
    )
    .min(1)
    .max(20),
});

export type QualificationResult = z.infer<typeof qualificationResultSchema>;
