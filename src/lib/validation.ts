import { z } from 'zod';

export const analyzeSubmissionSchema = z.object({
  inputValue: z
    .string()
    .trim()
    .min(
      3,
      'Enter a website URL, offer summary, or business idea (at least 3 characters).',
    )
    .max(500, 'Please keep your initial input under 500 characters.'),
  offerDescription: z
    .string()
    .trim()
    .max(1500, 'Offer description must be under 1,500 characters.')
    .optional(),
  objective: z
    .string()
    .trim()
    .min(1)
    .default('Discover & qualify ideal B2B buyers'),
  targetIndustry: z.string().trim().optional(),
  targetRegion: z.string().trim().optional(),
  companySize: z.string().trim().optional(),
  targetJobTitles: z.string().trim().optional(),
  maxCompanies: z.coerce.number().int().min(5).max(500).optional(),
  additionalInstructions: z.string().trim().max(1000).optional(),
});

export type AnalyzeSubmissionInput = z.infer<typeof analyzeSubmissionSchema>;

export const createCampaignSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Campaign name must be at least 3 characters.')
    .max(100),
  audienceSummary: z
    .string()
    .trim()
    .min(3, 'Describe your target audience.')
    .max(200),
  offerName: z
    .string()
    .trim()
    .min(2, 'Select or enter an associated offer.')
    .max(120),
  description: z
    .string()
    .trim()
    .min(10, 'Provide a short campaign goal (at least 10 characters).')
    .max(400),
  requireHumanApproval: z.boolean().default(true),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;

export const createOfferSchema = z.object({
  name: z.string().trim().min(3, 'Offer name is required.'),
  urlOrSource: z.string().trim().min(3, 'Website URL or source is required.'),
  summary: z.string().trim().min(10, 'Provide a brief value summary.'),
  targetDealSize: z.string().trim().min(2, 'Target deal size is required.'),
});

export const createAgentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, 'Agent name must be at least 3 characters.')
    .max(80),
  category: z.enum([
    'Research',
    'Qualification',
    'Outreach',
    'Analysis',
    'Content',
    'Analytics',
  ]),
  description: z
    .string()
    .trim()
    .min(10, 'Describe what this agent should accomplish.')
    .max(240),
  requiresApproval: z.boolean().default(true),
});
