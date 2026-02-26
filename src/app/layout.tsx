import type { Metadata } from "next";
import { ConfigProvider } from "antd";

import { UserProvider }          from "../app/lib/providers";
import { ClientProvider }        from "../app/lib/providers";
import { ContactProvider }       from "../app/lib/providers";
import { OpportunityProvider }   from "../app/lib/providers";
import { ProposalProvider }      from "../app/lib/providers";
import { PricingRequestProvider } from "../app/lib/providers";
import { ContractProvider }      from "../app/lib/providers";
import { ActivityProvider }      from "../app/lib/providers";
import { NoteProvider }          from "../app/lib/providers";

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