import type { Metadata } from "next";
import { ConfigProvider } from "antd";

import {
  UserProvider, ClientProvider, ContactProvider, OpportunityProvider,
  ProposalProvider, PricingRequestProvider, ContractProvider,
  ActivityProvider, NoteProvider,
} from "./lib/providers/provider";

export const metadata: Metadata = {
  title: "Login",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "black" }}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#f39c12",
              borderRadius: 8,
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