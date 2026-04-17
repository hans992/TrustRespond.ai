export type ComparisonRow = {
  feature: string;
  trustRespond: string;
  conveyor: string;
  vanta: string;
  trustCloud: string;
};

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    feature: "Starting Price",
    trustRespond: "$0 (Free tier)",
    conveyor: "$9,600/year",
    vanta: "~$10,000/year",
    trustCloud: "$2,999/year"
  },
  {
    feature: "AI Questionnaire Auto-fill",
    trustRespond: "✅ Included",
    conveyor: "✅ Included",
    vanta: "⚠ Add-on",
    trustCloud: "⚠ Basic"
  },
  {
    feature: "Format-preserving Excel Export",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌"
  },
  {
    feature: "GDPR-native (EU data residency)",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌"
  },
  {
    feature: "EU AI Act Evidence Pack",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌"
  },
  {
    feature: "Public Trust Center",
    trustRespond: "✅",
    conveyor: "✅",
    vanta: "✅",
    trustCloud: "✅"
  },
  {
    feature: "NDA-gated Documents",
    trustRespond: "✅ Pro+",
    conveyor: "✅",
    vanta: "✅",
    trustCloud: "❌"
  },
  {
    feature: "Self-serve Onboarding",
    trustRespond: "✅",
    conveyor: "❌ (sales call)",
    vanta: "❌ (sales call)",
    trustCloud: "✅"
  },
  {
    feature: "Free Tier Available",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌"
  },
  {
    feature: "BYOK (Bring Your Own LLM Key)",
    trustRespond: "✅",
    conveyor: "❌",
    vanta: "❌",
    trustCloud: "❌"
  }
];
