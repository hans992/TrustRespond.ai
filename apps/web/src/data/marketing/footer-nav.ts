export type FooterLink = { href: string; label: string; external?: boolean };

export type FooterNavSection = {
  title: string;
  links: FooterLink[];
};

export const FOOTER_NAV_SECTIONS: FooterNavSection[] = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/#how-it-works", label: "How It Works" },
      { href: "/#pricing", label: "Pricing" },
      { href: "/#features", label: "Trust Center" },
      { href: "/#security", label: "Security" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "mailto:legal@trustrespond.ai?subject=Contact", label: "Contact", external: true },
      { href: "https://andrijanic.dev", label: "andrijanic.dev", external: true }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/#privacy-notice", label: "Privacy summary (homepage)" },
      { href: "/legal/privacy-policy", label: "Privacy Policy" },
      { href: "/legal/terms-of-service", label: "Terms of Service" },
      { href: "/legal/dpa", label: "Data Processing Agreement" },
      { href: "/legal/cookies", label: "Cookie Policy" },
      { href: "/legal/impressum", label: "Impressum" },
      { href: "/legal/ai-system-information", label: "AI system information" }
    ]
  }
];
