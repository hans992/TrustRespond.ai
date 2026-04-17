export type PricingPlanConfig =
  | {
      id: "free";
      title: string;
      description: string;
      price: { kind: "static"; display: string; suffix: string };
      features: string[];
      cta: { label: string; variant: "primary" | "secondary" };
      animatedDelay: number;
      highlight: false;
    }
  | {
      id: "starter";
      title: string;
      description: string;
      price: {
        kind: "animated";
        layoutId: "starter-price";
        monthly: string;
        annual: string;
        suffix: string;
      };
      features: string[];
      cta: { label: string; variant: "primary" | "secondary" };
      animatedDelay: number;
      highlight: false;
    }
  | {
      id: "pro";
      title: string;
      description: string;
      price: {
        kind: "animated";
        layoutId: "pro-price";
        monthly: string;
        annual: string;
        suffix: string;
      };
      features: string[];
      cta: { label: string; variant: "primary" | "secondary" };
      animatedDelay: number;
      highlight: true;
    }
  | {
      id: "enterprise";
      title: string;
      description: string;
      price: { kind: "static"; display: string; suffix: string };
      features: string[];
      cta: { label: string; variant: "primary" | "secondary" };
      animatedDelay: number;
      highlight: false;
    };

export const PRICING_PLANS: PricingPlanConfig[] = [
  {
    id: "free",
    title: "Free",
    description: "For founders exploring the product",
    price: { kind: "static", display: "$0", suffix: "/month" },
    features: [
      "1 questionnaire per month",
      "Up to 5 policy documents",
      "Basic Trust Center page",
      "Excel & CSV export"
    ],
    cta: { label: "Get Started Free", variant: "secondary" },
    animatedDelay: 0,
    highlight: false
  },
  {
    id: "starter",
    title: "Starter",
    description: "For Series A teams closing enterprise deals",
    price: {
      kind: "animated",
      layoutId: "starter-price",
      monthly: "$299",
      annual: "$239",
      suffix: "/month"
    },
    features: [
      "10 questionnaires per month",
      "Up to 50 policy documents",
      "Branded Trust Center",
      "Excel, CSV & Word export",
      "Email support"
    ],
    cta: { label: "Start Free Trial", variant: "secondary" },
    animatedDelay: 0.1,
    highlight: false
  },
  {
    id: "pro",
    title: "Pro",
    description: "For scaling teams with a dedicated sales motion",
    price: {
      kind: "animated",
      layoutId: "pro-price",
      monthly: "$799",
      annual: "$639",
      suffix: "/month"
    },
    features: [
      "Unlimited questionnaires",
      "Unlimited policy documents",
      "Advanced Trust Center (NDA-gated docs)",
      "5 team seats",
      "EU AI Act evidence pack",
      "Priority AI processing",
      "Slack & HubSpot integration",
      "Priority support"
    ],
    cta: { label: "Start Free Trial", variant: "primary" },
    animatedDelay: 0.2,
    highlight: true
  },
  {
    id: "enterprise",
    title: "Enterprise",
    description: "For companies with strict compliance requirements",
    price: { kind: "static", display: "Custom", suffix: "" },
    features: [
      "Everything in Pro",
      "SSO / SAML 2.0",
      "BYOK (Bring Your Own LLM Key)",
      "Salesforce & HubSpot CRM sync",
      "Dedicated account manager",
      "SLA guarantees",
      "On-premise RAG option",
      "Custom data residency (EU)"
    ],
    cta: { label: "Contact Sales", variant: "secondary" },
    animatedDelay: 0.3,
    highlight: false
  }
];
