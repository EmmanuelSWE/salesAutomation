"use client";

import { useContext, useEffect } from "react";
import { useParams } from "next/navigation";
import ClientOverviewCard  from "../../../../components/loggedIn/clientOverview/clientOverviewCard/clientOverViewCard";
import ClientContactDetails from "../../../../components/loggedIn/clientOverview/clientContactDetails/clientContactDetails";
import ClientDocumentHistory from "../../../../components/loggedIn/clientOverview/clientDocumentHistory/clientDocumentHistory";
import ClientOpportunities  from "../../../../components/loggedIn/clientOverview/clientOpportunities/clientOpportunites";

import { ClientStateContext, ClientActionsContext } from "../../../../lib/providers/context";

import type { ProposalStep }   from "../../../../components/loggedIn/clientOverview/clientOverviewCard/clientOverViewCard";
import type { ContactCard }    from "../../../../components/loggedIn/clientOverview/clientContactDetails/clientContactDetails";
import type { InvoiceRow }     from "../../../../components/loggedIn/clientOverview/clientDocumentHistory/clientDocumentHistory";
import type { OpportunityRow } from "../../../../components/loggedIn/clientOverview/clientOpportunities/clientOpportunites";

/* ── Placeholder data — replace with fetch from your API ── */
const STEPS: ProposalStep[] = [
  { label: "Initial client discovery call",      done: true  },
  { label: "Proposal document drafted",          done: true  },
  { label: "Pricing review with finance team",   done: true  },
  { label: "Legal review of terms",              done: true  },
  { label: "Client approval on scope",           done: false },
  { label: "Contract signing",                   done: false },
  { label: "Onboarding kick-off scheduled",      done: false },
];

const CONTACTS: ContactCard[] = [
  { id: "1", name: "ByeWind",  value: "9656 6598 1236 4698", tag: "Recent"    },
  { id: "2", name: "ByeWind",  value: "1235 6321 1343 7542", tag: "Most Used" },
  { id: "3", name: "UserName", value: "byewind@twitter.com"                   },
];

const INVOICES: InvoiceRow[] = [
  { id: "1", date: "Feb 5, 2026", description: "Invoice for October 2026",   amount: "$123.79" },
  { id: "2", date: "Feb 4, 2026", description: "Invoice for September 2026", amount: "$98.03"  },
  { id: "3", date: "Feb 3, 2026", description: "Paypal",                     amount: "$35.07"  },
  { id: "4", date: "Feb 2, 2026", description: "Invoice for July 2026",      amount: "$142.80" },
  { id: "5", date: "Feb 1, 2026", description: "Invoice for June 2026",      amount: "$123.79" },
];

const OPPORTUNITIES: OpportunityRow[] = [
  { id: "1", title: "Enterprise SLA Renewal",    stage: "Negotiation",  value: "$120,000", closeDate: "Mar 30, 2026" },
  { id: "2", title: "New Module Expansion",       stage: "Proposal",     value: "$45,000",  closeDate: "Apr 15, 2026" },
  { id: "3", title: "Training Services Package",  stage: "Prospecting",  value: "$18,500",  closeDate: "May 1, 2026"  },
  { id: "4", title: "Annual Support Contract",    stage: "Closed Won",   value: "$72,000",  closeDate: "Feb 1, 2026"  },
  { id: "5", title: "Legacy Migration Project",   stage: "Closed Lost",  value: "$95,000",  closeDate: "Jan 15, 2026" },
];

export default function ClientOverview() {
  const params = useParams();
  const clientId = params.id as string;
  
  const clientState = useContext(ClientStateContext);
  const clientActions = useContext(ClientActionsContext);

  useEffect(() => {
    if (clientId && clientActions?.getOneClient) {
      clientActions.getOneClient(clientId);
    }
  }, [clientId, clientActions]);

  const clientName = clientState?.client?.name || "Loading...";

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        padding: "24px 28px",
        background: "#1a1a1a",
        minHeight: "100vh",
        boxSizing: "border-box",
      }}
    >
      {/* 1. Client name + project steps + active date + pricing + alert */}
      <ClientOverviewCard
        clientName={clientName}
        steps={STEPS}
        activeUntil="Dec 9, 2026"
        subscriptionNote="We will send you a notification upon Subscription expiration."
        pricePerMonth="$24.99"
        onCancelProject={() => console.log("cancel")}
        onRenewContract={() => console.log("renew")}
      />

      {/* 2. Contact details */}
      <ClientContactDetails
        contacts={CONTACTS}
        onAddContact={() => console.log("add contact")}
      />

      {/* 3. Document History — invoices */}
      <ClientDocumentHistory invoices={INVOICES} defaultPeriod="Month" />

      {/* 4. Opportunities — stuff to do */}
      <ClientOpportunities opportunities={OPPORTUNITIES} defaultPeriod="Month" />
    </div>
  );
}