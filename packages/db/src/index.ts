export { chunkArray, DOCUMENT_CHUNKS_INSERT_BATCH_SIZE, EMBEDDING_TEXT_BATCH_SIZE } from "./batch";
export { toPgVector } from "./vector";
export { fetchQuestionnaireForOrg, replaceQuestionnaireQuestions } from "./questionnaires";
export type Tier = "free" | "starter" | "pro" | "enterprise";
export type Confidence = "high" | "medium" | "low";

/** Monthly questionnaire limits per plan tier; `null` means unlimited. */
export const TIER_QUOTA_LIMITS: Record<Tier, number | null> = {
  free: 1,
  starter: 10,
  pro: null,
  enterprise: null
};

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
