"use client";

import { useContext, useEffect, useState } from "react";
import { useParams }    from "next/navigation";
import Link             from "next/link";
import ClientOverviewCard  from "../../../../components/loggedIn/clientOverview/clientOverviewCard/clientOverViewCard";
import ClientContactDetails from "../../../../components/loggedIn/clientOverview/clientContactDetails/clientContactDetails";
import ClientDocumentHistory from "../../../../components/loggedIn/clientOverview/clientDocumentHistory/clientDocumentHistory";
import ClientOpportunities  from "../../../../components/loggedIn/clientOverview/clientOpportunities/clientOpportunites";

import { 
  ClientStateContext, 
  ClientActionsContext,
  ContactStateContext,
  ContactActionsContext,
  OpportunityStateContext,
  OpportunityActionsContext,
} from "../../../../lib/providers/context";

import type { ProposalStep }   from "../../../../components/loggedIn/clientOverview/clientOverviewCard/clientOverViewCard";
import type { ContactCard }    from "../../../../components/loggedIn/clientOverview/clientContactDetails/clientContactDetails";
import type { InvoiceRow }     from "../../../../components/loggedIn/clientOverview/clientDocumentHistory/clientDocumentHistory";
import type { OpportunityRow } from "../../../../components/loggedIn/clientOverview/clientOpportunities/clientOpportunites";

/* ── Placeholder data for features not yet implemented ── */
const PLACEHOLDER_STEPS: ProposalStep[] = [
  { label: "Initial client discovery call",      done: true  },
  { label: "Proposal document drafted",          done: true  },
  { label: "Pricing review with finance team",   done: true  },
  { label: "Legal review of terms",              done: true  },
  { label: "Client approval on scope",           done: false },
  { label: "Contract signing",                   done: false },
  { label: "Onboarding kick-off scheduled",      done: false },
];

const PLACEHOLDER_INVOICES: InvoiceRow[] = [
  { id: "1", date: "Feb 5, 2026", description: "Invoice for October 2026",   amount: "$123.79" },
  { id: "2", date: "Feb 4, 2026", description: "Invoice for September 2026", amount: "$98.03"  },
  { id: "3", date: "Feb 3, 2026", description: "Paypal",                     amount: "$35.07"  },
  { id: "4", date: "Feb 2, 2026", description: "Invoice for July 2026",      amount: "$142.80" },
  { id: "5", date: "Feb 1, 2026", description: "Invoice for June 2026",      amount: "$123.79" },
];

export default function ClientOverview() {
  const params = useParams();
  const clientId = params.id as string;
  
  const clientState = useContext(ClientStateContext);
  const clientActions = useContext(ClientActionsContext);
  
  const contactState = useContext(ContactStateContext);
  const contactActions = useContext(ContactActionsContext);
  
  const opportunityState = useContext(OpportunityStateContext);
  const opportunityActions = useContext(OpportunityActionsContext);

  const [contacts, setContacts] = useState<ContactCard[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityRow[]>([]);

  // Fetch client data
  useEffect(() => {
    if (clientId && clientActions?.getOneClient) {
      clientActions.getOneClient(clientId);
    }
  }, [clientId, clientActions]);

  // Fetch contacts for this client
  useEffect(() => {
    if (clientId && contactActions?.getContactsByClient) {
      contactActions.getContactsByClient(clientId);
    }
  }, [clientId, contactActions]);

  // Fetch opportunities for this client
  useEffect(() => {
    if (clientId && opportunityActions?.getOpportunities) {
      opportunityActions.getOpportunities({ clientId });
    }
  }, [clientId, opportunityActions]);

  // Transform contacts from API to ContactCard format
  useEffect(() => {
    if (contactState?.contacts && Array.isArray(contactState.contacts)) {
      const transformedContacts: ContactCard[] = contactState.contacts.map((contact: any) => ({
        id: contact.id || contact._id,
        name: `${contact.firstName || ''} ${contact.lastName || ''}`.trim() || "Unknown",
        value: contact.email || contact.phone || "No contact info",
        // Only set tag if it matches the expected values
        tag: (contact.role === "Recent" || contact.role === "Most Used") ? contact.role : undefined,
      }));
      setContacts(transformedContacts);
    }
  }, [contactState?.contacts]);

  // Transform opportunities from API to OpportunityRow format
  useEffect(() => {
    if (opportunityState?.opportunities && Array.isArray(opportunityState.opportunities)) {
      const transformedOpps: OpportunityRow[] = opportunityState.opportunities.map((opp: any) => ({
        id: opp.id || opp._id,
        title: opp.name || opp.title || "Untitled Opportunity",
        stage: opp.stage || opp.currentStage || "Unknown",
        value: opp.value ? `$${Number(opp.value).toLocaleString()}` : "$0",
        closeDate: opp.closeDate ? new Date(opp.closeDate).toLocaleDateString('en-US', { 
          month: 'short', 
          day: 'numeric', 
          year: 'numeric' 
        }) : "TBD",
      }));
      setOpportunities(transformedOpps);
    }
  }, [opportunityState?.opportunities]);

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
      {/* ── Action bar ── */}
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <Link
          href={`/Client/${clientId}/createProposal`}
          style={{
            display:        "inline-block",
            padding:        "8px 18px",
            borderRadius:   8,
            background:     "#4caf50",
            color:          "#fff",
            fontWeight:     600,
            fontSize:       13,
            textDecoration: "none",
            letterSpacing:  "0.02em",
          }}
        >
          + Create Proposal
        </Link>
      </div>

      {/* 1. Client name + project steps + active date + pricing + alert */}
      <ClientOverviewCard
        clientName={clientName}
        steps={PLACEHOLDER_STEPS}
        activeUntil="Dec 9, 2026"
        subscriptionNote="We will send you a notification upon Subscription expiration."
        pricePerMonth="$24.99"
        onCancelProject={() => console.log("cancel")}
        onRenewContract={() => console.log("renew")}
      />

      {/* 2. Contact details - Now using real data from API */}
      <ClientContactDetails
        contacts={contacts.length > 0 ? contacts : []}
        addContactHref={`/Client/${clientId}/createContact`}
      />

      {/* 3. Document History — invoices (placeholder until invoice API is ready) */}
      <ClientDocumentHistory invoices={PLACEHOLDER_INVOICES} defaultPeriod="Month" />

      {/* 4. Opportunities - Now using real data from API */}
      <ClientOpportunities 
        opportunities={opportunities.length > 0 ? opportunities : []} 
        defaultPeriod="Month" 
      />
    </div>
  );
}