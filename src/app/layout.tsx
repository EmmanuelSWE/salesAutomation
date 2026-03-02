/**
 * Root layout â€” App Router (Server Component).
 *
 * Exports `metadata` for Next.js to inject <head> tags server-side.
 * All client-only code (NotificationBell, hooks) lives in
 * ./components/NotificationBell.tsx.
 */
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Script from "next/script";
import { ConfigProvider } from "antd";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import {
  UserProvider,
  ClientProvider,
  ContactProvider,
  OpportunityProvider,
  ProposalProvider,
  PricingRequestProvider,
  ContractProvider,
  ActivityProvider,
  NoteProvider,
} from "./lib/providers/provider";
import NotificationBell from "./components/NotificationBell";


   
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});


export const metadata: Metadata = {
  title: {
    default: "TransformSales â€” CRM & Pipeline Management",
    template: "%s | TransformSales",
  },
  description:
    "TransformSales gives your sales team a single place to manage clients, opportunities, proposals, contracts, and activities â€” from first contact to closed deal.",
  robots: { index: true, follow: true },
  alternates: { canonical: "https://transformsales.app" },
  openGraph: {
    type:        "website",
    siteName:    "TransformSales",
    title:       "TransformSales â€” CRM & Pipeline Management",
    description: "Manage your full sales cycle: clients, pipeline, proposals, and contracts in one place.",
    url:         "https://transformsales.app",
    images: [{ url: "https://transformsales.app/og-image.png", width: 1200, height: 630, alt: "TransformSales dashboard" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "TransformSales â€” CRM & Pipeline Management",
    description: "Manage your full sales cycle in one place.",
    images:      ["https://transformsales.app/og-image.png"],
  },
};



const JSON_LD_WEBSITE = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TransformSales",
  "url": "https://transformsales.app",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://transformsales.app/clients?q={search_term_string}",
    "query-input": "required name=search_term_string",
  },
});
  
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body style={{ backgroundColor: "black" }}>
        {/* JSON-LD â€” WebSite schema */}
        <Script
          id="jsonld-website"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON_LD_WEBSITE }}
          strategy="afterInteractive"
        />

        <ConfigProvider
          theme={{
            token: {
              colorPrimary:  "#f39c12",
              borderRadius:  8,
              fontFamily:    "var(--font-inter)",
            },
          }}
        >
          <UserProvider>
            <ClientProvider>
              <ContactProvider>
                <OpportunityProvider>
                  <ProposalProvider>
                    <PricingRequestProvider>
                      <ContractProvider>
                        <ActivityProvider>
                          <NoteProvider>
                            {/* Bell lives inside UserProvider so it can read user.roles */}
                           
                            {children}
                          </NoteProvider>
                        </ActivityProvider>
                      </ContractProvider>
                    </PricingRequestProvider>
                  </ProposalProvider>
                </OpportunityProvider>
              </ContactProvider>
            </ClientProvider>
          </UserProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
