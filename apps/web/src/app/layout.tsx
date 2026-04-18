import "./globals.css";
import { ConditionalAnalytics } from "@/components/consent/ConditionalAnalytics";
import { CookieConsentBanner } from "@/components/consent/CookieConsentBanner";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TrustRespond.ai | Automate Security Questionnaires in 2 Hours",
    template: "%s | TrustRespond.ai",
  },
  description:
    "TrustRespond reads your SOC 2 and security policies, then auto-completes your client's 200-row Excel questionnaire in under 2 hours - without breaking formatting. Built for EU SaaS teams.",
  keywords: [
    "security questionnaire automation",
    "SOC 2 questionnaire",
    "vendor security review",
    "GDPR compliance",
    "enterprise sales automation",
    "AI security review",
    "Excel questionnaire automation",
  ],
  authors: [{ name: "TrustRespond.ai", url: "https://trustrespond.ai" }],
  openGraph: {
    type: "website",
    locale: "en_EU",
    url: "https://trustrespond.ai",
    siteName: "TrustRespond.ai",
    title: "Automated Security Questionnaires in 2 Hours | TrustRespond.ai",
    description:
      "AI-powered security questionnaire automation for EU SaaS teams. Upload your policies. Get a completed Excel file in 2 hours.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TrustRespond.ai - Security Questionnaire Automation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TrustRespond.ai | Automated Security Questionnaires in 2 Hours",
    description:
      "Upload your SOC 2. Get a completed 200-row questionnaire in 2 hours. Built for EU SaaS.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
  metadataBase: new URL("https://trustrespond.ai"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 antialiased`}>
        {children}
        <CookieConsentBanner />
        <ConditionalAnalytics />
      </body>
    </html>
  );
}
