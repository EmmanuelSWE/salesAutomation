"use client";

import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useParams }    from "next/navigation";
import { message }     from "antd";
import api             from "../../../../lib/utils/axiosInstance";
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
  ContractStateContext,
  ContractActionsContext,
} from "../../../../lib/providers/context";

import type { ProposalStep }   from "../../../../components/loggedIn/clientOverview/clientOverviewCard/clientOverViewCard";
import type { ContactCard }    from "../../../../components/loggedIn/clientOverview/clientContactDetails/clientContactDetails";
import type { InvoiceRow }     from "../../../../components/loggedIn/clientOverview/clientDocumentHistory/clientDocumentHistory";
import type { OpportunityRow } from "../../../../components/loggedIn/clientOverview/clientOpportunities/clientOpportunites";
import ClientProposals         from "../../../../components/loggedIn/clientOverview/clientProposals/clientProposals";
import ClientContracts         from "../../../../components/loggedIn/clientOverview/clientContracts/clientContracts";
import ClientActionsCard       from "../../../../components/loggedIn/clientOverview/clientActionsCard/clientActionsCard";
import ClientPricingRequests   from "../../../../components/loggedIn/clientOverview/clientPricingRequests/clientPricingRequests";

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

  const contractState   = useContext(ContractStateContext);
  const contractActions = useContext(ContractActionsContext);

  const [contacts, setContacts] = useState<ContactCard[]>([]);
  const [opportunities, setOpportunities] = useState<OpportunityRow[]>([]);

  /* ── Client Stats ── */
  type ClientStats = {
    totalOpportunities?: number;
    totalProposals?:     number;
    totalContracts?:     number;
    totalRevenue?:       number;
    openActivities?:     number;
    overdueActivities?:  number;
    [key: string]: unknown;
  };
  const [stats,        setStats]        = useState<ClientStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    if (!clientId) return;
    setStatsLoading(true);
    try {
      const { data } = await api.get<ClientStats>(`/clients/${clientId}/stats`);
      setStats(data);
    } catch {
      // Stats are non-critical; fail silently unless needed
      message.error("Could not load client stats");
    } finally {
      setStatsLoading(false);
    }
  }, [clientId]);

  // Fetch client data
  useEffect(() => {
    if (clientId && clientActions?.getOneClient) {
      clientActions.getOneClient(clientId);
    }
    fetchStats();
  }, [clientId, clientActions, fetchStats]);

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

  // Fetch proposals list for this client
  useEffect(() => {
    if (clientId && proposalActions?.getProposals) {
      proposalActions.getProposals({ clientId });
    }
  }, [clientId, proposalActions]);

  // Fetch contracts for this client
  useEffect(() => {
    if (clientId && contractActions?.getContractsByClient) {
      contractActions.getContractsByClient(clientId);
    }
  }, [clientId, contractActions]);

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

  /* ── Derive current proposal (most recent open one) ── */
  const allProposals  = useMemo(() => proposalState?.proposals ?? [], [proposalState?.proposals]);
  const currentProposal = useMemo(() => {
    // Only consider open proposals — exclude Rejected
    const open = allProposals.filter((p) => p.status !== "Rejected");
    if (open.length === 0) return null;
    return [...open].sort((a, b) =>
      new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
    )[0];
  }, [allProposals]);

  // Once the most-recent open proposal is identified, fetch its full record (includes lineItems)
  useEffect(() => {
    if (currentProposal?.id && proposalActions?.getOneProposal) {
      proposalActions.getOneProposal(currentProposal.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProposal?.id]);

  // Use the fully-fetched proposal (has lineItems) when available, fall back to the list item
  const fullProposal =
    proposalState?.proposal?.id != null && proposalState.proposal.id === currentProposal?.id
      ? proposalState.proposal
      : currentProposal;

  /* Line items → ProposalStep[]
     Prefer structured lineItems; fall back to scopeItems (plain strings from form).
     A step is "done" (purple) when the proposal is Approved, otherwise grey.    */
  const proposalSteps: ProposalStep[] = useMemo(() => {
    if (!fullProposal) return [];
    const isDone = fullProposal.status === "Approved";

    if (fullProposal.lineItems?.length) {
      return fullProposal.lineItems.map((item) => ({
        label: item.productServiceName || "Item",
        done:  isDone,
      }));
    }

    if (fullProposal.scopeItems?.length) {
      return fullProposal.scopeItems.map((text) => ({
        label: text,
        done:  isDone,
      }));
    }

    return [];
  }, [fullProposal]);

  /* Total value of current proposal */
  const proposalTotal = useMemo(() => {
    if (!fullProposal?.lineItems?.length) return "—";
    const total = fullProposal.lineItems.reduce((sum, item) => {
      const base     = item.quantity * item.unitPrice;
      const afterDis = base * (1 - (item.discount ?? 0) / 100);
      const withTax  = afterDis * (1 + (item.taxRate ?? 0) / 100);
      return sum + (item.lineTotal ?? withTax);
    }, 0);
    return `$${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }, [fullProposal]);

  const activeUntil = fullProposal?.validUntil ?? "";
  const subscriptionNote = fullProposal
    ? `${fullProposal.title} · ${fullProposal.currency}`
    : "No active proposal for this client.";

  async function handleCancelProject() {
    const opportunityId = fullProposal?.opportunityId;
    if (!opportunityId) return;
    if (!globalThis.confirm("Cancel this project? This will mark the opportunity as Closed Lost.")) return;
    await opportunityActions.advanceStage(opportunityId, 6, "Project cancelled");
    // Refresh both opportunities and proposals for this client
    opportunityActions.getOpportunities({ clientId });
    proposalActions.getProposals({ clientId });
  }

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
      {/* ── Client Stats Grid ── */}
      {(statsLoading || stats) && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
            gap: 12,
          }}
          aria-label="Client statistics"
        >
          {[
            { label: "Opportunities", value: stats?.totalOpportunities,   color: "#2979ff" },
            { label: "Proposals",     value: stats?.totalProposals,       color: "#9aa0dc" },
            { label: "Contracts",     value: stats?.totalContracts,       color: "#4caf50" },
            { label: "Revenue",       value: stats?.totalRevenue != null ? `$${Number(stats.totalRevenue).toLocaleString()}` : undefined, color: "#f5a623" },
            { label: "Open Activities",   value: stats?.openActivities,    color: "#29b6f6" },
            { label: "Overdue Activities", value: stats?.overdueActivities, color: "#ef5350" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              style={{
                background: "#252525",
                borderRadius: 12,
                padding: "14px 16px",
                border: "1px solid #333",
                display: "flex",
                flexDirection: "column",
                gap: 4,
              }}
            >
              {statsLoading ? (
                <div style={{
                  height: 24, borderRadius: 6, background: "#333",
                  animation: "pulse 1.4s ease-in-out infinite",
                }} />
              ) : (
                <span style={{ fontSize: 22, fontWeight: 700, color, lineHeight: 1.2 }}>
                  {value ?? "—"}
                </span>
              )}
              <span style={{ fontSize: 11, color: "#666", fontWeight: 500 }}>{label}</span>
            </div>
          ))}
        </div>
      )}

      {/* 1. Client name + current proposal line items + active date + pricing + alert */}
      <ClientOverviewCard
        clientName={clientName}
        steps={proposalSteps}
        proposalTitle={fullProposal?.title}
        proposalIsPending={proposalState?.isPending ?? false}
        activeUntil={activeUntil}
        subscriptionNote={subscriptionNote}
        pricePerMonth={proposalTotal}
        onCancelProject={() => handleCancelProject()}
        onRenewContract={() => { /* renewal handled via + Renewal button in ClientContracts */ }}
      />

      {/* 2. Quick actions — current proposal management, pricing request, expiring contracts */}
      <ClientActionsCard
        proposal={fullProposal ?? null}
        contracts={contractState?.contracts ?? []}
        clientId={clientId}
        clientName={clientName}
      />

      {/* 3. Pricing Requests for this client */}
      <ClientPricingRequests
        opportunityId={fullProposal?.opportunityId}
        clientId={clientId}
      />

      {/* Contact details - Now using real data from API */}
      <ClientContactDetails
        contacts={contacts.length > 0 ? contacts : []}
        addContactHref={`/Client/${clientId}/createContact`}
      />

      {/* 3. Document History — invoices (placeholder until invoice API is ready) */}
      <ClientDocumentHistory invoices={PLACEHOLDER_INVOICES} defaultPeriod="Month" />

      {/* 4. Opportunities - Now using real data from API */}
      <ClientOpportunities
        opportunities={opportunities.length > 0 ? opportunities : []}
        clientId={clientId}
        defaultPeriod="Month"
        createHref={`/Client/${clientId}/createOpportunity`}
        createProposalHref={(oppId) => `/Client/${clientId}/createProposal?opportunityId=${oppId}`}
      />

      {/* 5. Proposals */}
      <ClientProposals
        proposals={proposalState?.proposals ?? []}
        isPending={proposalState?.isPending ?? false}
        isError={proposalState?.isError ?? false}
        clientId={clientId}
        createHref=""
      />

      {/* 6. Contracts */}
      <ClientContracts
        contracts={contractState?.contracts ?? []}
        clientId={clientId}
        isPending={contractState?.isPending}
        isError={contractState?.isError}
      />
    </div>
  );
}