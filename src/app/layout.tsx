import type { Metadata } from "next";
import { ConfigProvider } from "antd";

import { UserProvider }          from "./lib/providers/provider";
import { ClientProvider }        from "./lib/providers/provider";
import { ContactProvider }       from "./lib/providers/provider";
import { OpportunityProvider }   from "./lib/providers/provider";
import { ProposalProvider }      from "./lib/providers/provider";
import { PricingRequestProvider } from "./lib/providers/provider";
import { ContractProvider }      from "./lib/providers/provider";
import { ActivityProvider }      from "./lib/providers/provider";
import { NoteProvider }          from "./lib/providers/provider";

export const metadata: Metadata = {
  title: "Login",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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