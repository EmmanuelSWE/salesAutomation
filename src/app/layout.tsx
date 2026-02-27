import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { ConfigProvider } from "antd";
import "./globals.css";

import {
  UserProvider, ClientProvider, ContactProvider, OpportunityProvider,
  ProposalProvider, PricingRequestProvider, ContractProvider,
  ActivityProvider, NoteProvider,
} from "./lib/providers/provider";

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
  title: "TransformSales",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body style={{ backgroundColor: "black" }}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#f39c12",
              borderRadius: 8,
              fontFamily: "var(--font-inter)",
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