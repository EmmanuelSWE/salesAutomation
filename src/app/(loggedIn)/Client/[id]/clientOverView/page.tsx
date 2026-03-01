"use client";

import { useContext, useEffect, useMemo, useState } from "react";
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
  ProposalStateContext,
  ProposalActionsContext,
} from "../../../../lib/providers/context";

import type { ProposalStep }   from "../../../../components/loggedIn/clientOverview/clientOverviewCard/clientOverViewCard";
import type { ContactCard }    from "../../../../components/loggedIn/clientOverview/clientContactDetails/clientContactDetails";
import type { InvoiceRow }     from "../../../../components/loggedIn/clientOverview/clientDocumentHistory/clientDocumentHistory";
import type { OpportunityRow } from "../../../../components/loggedIn/clientOverview/clientOpportunities/clientOpportunites";
import ClientProposals         from "../../../../components/loggedIn/clientOverview/clientProposals/clientProposals";

/* ── Placeholder invoices (until invoice API is ready) ── */
const PLACEHOLDER_INVOICES: InvoiceRow[] = [
  { id: "1", date: "Feb 5, 2026",  description: "Invoice for October 2026",   amount: "$123.79" },
  { id: "2", date: "Feb 4, 2026",  description: "Invoice for September 2026", amount: "$98.03"  },
  { id: "3", date: "Feb 3, 2026",  description: "Paypal",                     amount: "$35.07"  },
  { id: "4", date: "Feb 2, 2026",  description: "Invoice for July 2026",      amount: "$142.80" },
  { id: "5", date: "Feb 1, 2026",  description: "Invoice for June 2026",      amount: "$123.79" },
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

  const proposalState   = useContext(ProposalStateContext);
  const proposalActions = useContext(ProposalActionsContext);

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

  // Fetch proposals for this client
  useEffect(() => {
    if (clientId && proposalActions?.getProposals) {
      proposalActions.getProposals({ clientId });
    }
  }, [clientId, proposalActions]);

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

  /* ── Derive current proposal (most recent) ── */
  const allProposals  = useMemo(() => proposalState?.proposals ?? [], [proposalState?.proposals]);
  const currentProposal = useMemo(() => {
    if (allProposals.length === 0) return null;
    return [...allProposals].sort((a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )[0];
  }, [allProposals]);

  /* Line items → ProposalStep[]
     A line item is "done" when the proposal has been Approved.    */
  const proposalSteps: ProposalStep[] = useMemo(() => {
    if (!currentProposal?.lineItems?.length) return [];
    const isDone = currentProposal.status === "Approved";
    return currentProposal.lineItems.map((item) => ({
      label: item.productServiceName,
      done:  isDone,
    }));
  }, [currentProposal]);

  /* Total value of current proposal */
  const proposalTotal = useMemo(() => {
    if (!currentProposal?.lineItems?.length) return "—";
    const total = currentProposal.lineItems.reduce((sum, item) => {
      const base     = item.quantity * item.unitPrice;
      const afterDis = base * (1 - (item.discount ?? 0) / 100);
      const withTax  = afterDis * (1 + (item.taxRate ?? 0) / 100);
      return sum + (item.lineTotal ?? withTax);
    }, 0);
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [currentProposal]);

  const activeUntil = currentProposal?.validUntil ?? "";
  const subscriptionNote = currentProposal
    ? `${currentProposal.title} · ${currentProposal.currency}`
    : "No active proposal for this client.";

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

      {/* 1. Client name + current proposal line items + active date + pricing + alert */}
      <ClientOverviewCard
        clientName={clientName}
        steps={proposalSteps}
        proposalTitle={currentProposal?.title}
        proposalIsPending={proposalState?.isPending ?? false}
        activeUntil={activeUntil}
        subscriptionNote={subscriptionNote}
        pricePerMonth={proposalTotal}
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

      {/* 5. Proposals */}
      <ClientProposals
        proposals={proposalState?.proposals ?? []}
        isPending={proposalState?.isPending ?? false}
        isError={proposalState?.isError ?? false}
        clientId={clientId}
        createHref={`/Client/${clientId}/createOpportunity`}
      />
    </div>
  );
}