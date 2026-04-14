export type Tier = "free" | "starter" | "pro" | "enterprise";
export type Confidence = "high" | "medium" | "low";
export const STORAGE_BUCKETS = {
  knowledgeBase: "knowledge-base",
  questionnaires: "questionnaires"
} as const;

export interface Organization {
  id: string;
  name: string;
  plan: Tier;
  monthlyQuota: number;
  quotaUsed: number;
}

export interface QuestionnaireQuestion {
  id: string;
  orgId: string;
  questionnaireId: string;
  questionText: string;
  answerText: string | null;
  confidence: Confidence | null;
  status: "pending" | "generated" | "approved" | "edited" | "rejected";
  sourceChunks: string[];
}

export interface TrustCenterPage {
  id: string;
  orgId: string;
  slug: string;
  title: string;
  description: string;
  isPublished: boolean;
  ndaRequired: boolean;
}

const quotas: Record<Tier, number> = {
  free: 1,
  starter: 10,
  pro: Number.MAX_SAFE_INTEGER,
  enterprise: Number.MAX_SAFE_INTEGER
};

export class BillingService {
  private usage = new Map<string, { used: number; remaining: number }>();

  reserveQuestionnaireUsage(orgId: string, tier: Tier) {
    const prior = this.usage.get(orgId) ?? { used: 0, remaining: quotas[tier] };
    if (prior.remaining <= 0) {
      throw new Error("Monthly questionnaire quota exceeded");
    }
    const next = { used: prior.used + 1, remaining: prior.remaining - 1 };
    this.usage.set(orgId, next);
    return next;
  }
}
