"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EditOutlined, FileAddOutlined, DollarOutlined, ReloadOutlined } from "@ant-design/icons";
import { useCardStyles } from "../card/card.module";
import {
  useProposalAction,
  usePricingRequestAction,
  useActivityAction,
  useContractAction,
  useUserState,
  useUserAction,
} from "../../../../lib/providers/provider";
import type { IProposal, IContract } from "../../../../lib/providers/context";
import type { ProposalStatus } from "../../../../lib/utils/apiEnums";

interface ClientActionsCardProps {
  proposal:   IProposal | null;
  contracts:  IContract[];
  clientId:   string;
  clientName: string;
}

const STATUS_COLORS: Record<ProposalStatus, { bg: string; color: string }> = {
  Draft:     { bg: "rgba(120,120,120,0.18)", color: "#999" },
  Submitted: { bg: "rgba(92,107,192,0.18)",  color: "#9aa0dc" },
  Approved:  { bg: "rgba(76,175,80,0.18)",   color: "#4caf50" },
  Rejected:  { bg: "rgba(244,67,54,0.16)",   color: "#f44336" },
};

const STATUS_TRANSITIONS: Record<string, ProposalStatus[]> = {
  Draft:     ["Submitted", "Approved", "Rejected"],
  Submitted: ["Approved", "Rejected"],
};

function isManager(role?: string, roles?: string[]): boolean {
  const check = (r: string) => r === "Admin" || r === "SalesManager";
  if (role && check(role)) return true;
  return roles?.some(check) ?? false;
}

function in14Days(): string {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return d.toISOString().split("T")[0];
}

/* ── shared button style helper ── */
function btn(bg: string, border: string, color: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 5,
    padding: "5px 14px", borderRadius: 16, fontSize: 12, fontWeight: 600,
    background: bg, border: `1px solid ${border}`, color, cursor: "pointer",
    transition: "opacity 0.15s",
  };
}

const inlineInput: React.CSSProperties = {
  background: "#1e1e1e", border: "1px solid #333", color: "#ccc",
  borderRadius: 6, padding: "5px 8px", fontSize: 12, outline: "none",
};

export default function ClientActionsCard({
  proposal,
  contracts,
  clientId,
  clientName,
}: Readonly<ClientActionsCardProps>) {
  const { styles: card } = useCardStyles();
  const proposalActions  = useProposalAction();
  const pricingActions   = usePricingRequestAction();
  const activityActions  = useActivityAction();
  const contractActions  = useContractAction();
  const { user, users }  = useUserState();
  const { getUsers }     = useUserAction();

  const canManage   = isManager(user?.role, user?.roles);
  const salesReps   = (users ?? []).filter((u) => u.role === "SalesRep" || u.roles?.includes("SalesRep"));
  const proposalStatus = proposal?.status ?? "Draft";

  /* ── status change state ── */
  const [showStatus, setShowStatus] = useState(false);
  const [newStatus, setNewStatus]   = useState<ProposalStatus>("Submitted");
  const [reason, setReason]         = useState("");

  /* ── pricing request state ── */
  const [showPricing, setShowPricing] = useState(false);
  const [repId, setRepId]             = useState("");
  const [priority, setPriority]       = useState("Medium");
  const [reqByDate, setReqByDate]     = useState(in14Days());
  const [pricingNotes, setPricingNotes] = useState("");

  /* ── shared ── */
  const [busy, setBusy]       = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /* Load sales reps */
  useEffect(() => {
    getUsers({ isActive: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /* Reset status dropdown when proposal changes */
  useEffect(() => {
    const transitions = STATUS_TRANSITIONS[proposalStatus] ?? [];
    setNewStatus(transitions[0] ?? "Submitted");
    setShowStatus(false);
    setReason("");
  }, [proposalStatus]);

  /* ── contract check ── */
  const contractsList = Array.isArray(contracts) ? contracts : [];
  const hasContractForProposal =
    !!proposal?.id && contractsList.some((c) => c.proposalId === proposal.id);

  /* ── expiring contracts ── */
  const expiringContracts = contractsList.filter((c) => c.isExpiringSoon && c.status === "Active");

  /* ── handlers ── */
  async function handleStatusChange() {
    if (!proposal?.id) return;
    if (newStatus === "Rejected" && !reason.trim()) {
      setError("A rejection reason is required.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await proposalActions.updateStatus(proposal.id, newStatus, clientId, reason.trim() || undefined);
      setShowStatus(false);
      setReason("");
      setSuccess(`Proposal moved to ${newStatus}.`);
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError("Failed to update proposal status.");
    } finally {
      setBusy(false);
    }
  }

  /* ── helpers ── */
  function todayIso(): string {
    return new Date().toISOString().split("T")[0] + "T00:00:00Z";
  }
  function oneYearIso(): string {
    const d = new Date();
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split("T")[0] + "T00:00:00Z";
  }

  async function handleCreateContract() {
    if (!proposal?.id) return;
    setBusy(true);
    setError(null);
    try {
      const contractValue =
        proposal.lineItems?.reduce((sum, item) => sum + (item.lineTotal ?? 0), 0) ?? 0;

      await contractActions.createContract({
        clientId,
        opportunityId:  proposal.opportunityId || undefined,
        proposalId:     proposal.id,
        title:          proposal.title || `Contract for ${clientName}`,
        contractValue,
        currency:       proposal.currency || "ZAR",
        startDate:      todayIso(),
        endDate:        oneYearIso(),
        ownerId:        user?.id || undefined,
      });

      setSuccess("Contract created successfully.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Failed to create contract.");
    } finally {
      setBusy(false);
    }
  }

  async function handleRequestPricing() {
    if (!repId) { setError("Select a sales rep."); return; }
    setBusy(true);
    setError(null);
    try {
      /* Build description: combine proposal context + optional notes */
      const descParts: string[] = [];
      if (proposal?.title)      descParts.push(`For proposal: ${proposal.title}`);
      if (pricingNotes?.trim()) descParts.push(pricingNotes.trim());

      const pricingPayload: Record<string, unknown> = {
        title:          `Pricing request for ${clientName || clientId}`,
        assignedToId:   repId,
        priority,
        requiredByDate: reqByDate,   // plain date string "YYYY-MM-DD"
      };
      if (descParts.length)        pricingPayload.description  = descParts.join(" — ");
      if (proposal?.opportunityId) pricingPayload.opportunityId = proposal.opportunityId;

      await pricingActions.createPricingRequest(pricingPayload);

      const activityPayload = {
        type:          "Task",
        subject:       `Pricing request: ${clientName || clientId}`,
        description:   proposal
            ? `You have been assigned a pricing request for proposal "${proposal.title}". Please prepare a detailed pricing breakdown.`
            : "You have been assigned a pricing request. Please prepare a detailed pricing breakdown.",
        assignedToId:  repId,
        priority:      "High",
        dueDate:       `${reqByDate}T09:00:00`,
        relatedToType: "Client",
        relatedToId:   clientId,
      };

      await activityActions.createActivity(activityPayload);

      setShowPricing(false);
      setRepId("");
      setPricingNotes("");
      setReqByDate(in14Days());
      setSuccess("Pricing request created and rep notified.");
      setTimeout(() => setSuccess(null), 4000);
    } catch {
      setError("Failed to create pricing request.");
    } finally {
      setBusy(false);
    }
  }

  const statusTransitions = STATUS_TRANSITIONS[proposalStatus] ?? [];
  const statusColor = STATUS_COLORS[proposalStatus] ?? STATUS_COLORS.Draft;

  return (
    <div className={card.card}>
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Client Actions</h3>
      </div>
      <hr className={card.divider} />

      {/* ── Feedback messages ── */}
      {error && (
        <div style={{ margin: "6px 0", padding: "8px 14px", background: "rgba(244,67,54,0.08)",
          border: "1px solid rgba(244,67,54,0.3)", borderRadius: 8, color: "#f44336", fontSize: 12 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ margin: "6px 0", padding: "8px 14px", background: "rgba(76,175,80,0.08)",
          border: "1px solid rgba(76,175,80,0.3)", borderRadius: 8, color: "#4caf50", fontSize: 12 }}>
          {success}
        </div>
      )}

      {/* ══════════════════════════════
          SECTION 1 — Current Proposal
      ══════════════════════════════ */}
      <div style={{ padding: "14px 0 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: 10 }}>
          Current Proposal
        </div>

        {proposal ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {/* Title + status badge */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>
                {proposal.title || "Untitled Proposal"}
              </span>
              <span style={{ padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                background: statusColor.bg, color: statusColor.color }}>
                {proposalStatus}
              </span>
            </div>

            {/* Action buttons row */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              {/* Edit */}
              <Link
                href={`/Client/${clientId}/createProposal?proposalId=${proposal.id}`}
                style={btn("rgba(245,166,35,0.1)", "rgba(245,166,35,0.35)", "#f5a623")}
              >
                <EditOutlined style={{ fontSize: 11 }} /> Edit Proposal
              </Link>

              {/* Change Status — Draft or Submitted, managers only */}
              {canManage && statusTransitions.length > 0 && (
                <button
                  type="button"
                  style={btn("rgba(92,107,192,0.1)", "rgba(92,107,192,0.35)", "#9aa0dc")}
                  onClick={() => { setShowStatus((v) => !v); setError(null); }}
                  disabled={busy}
                >
                  Change Status
                </button>
              )}

              {/* Create Contract — Approved + no contract yet */}
              {proposalStatus === "Approved" && !hasContractForProposal && (
                <button
                  type="button"
                  onClick={handleCreateContract}
                  disabled={busy}
                  style={btn("rgba(76,175,80,0.1)", "rgba(76,175,80,0.35)", "#4caf50")}
                  title="Create a contract from this approved proposal"
                >
                  <FileAddOutlined style={{ fontSize: 11 }} /> Create Contract
                </button>
              )}
            </div>

            {/* Inline status change form */}
            {showStatus && canManage && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "10px 14px",
                background: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: 8, maxWidth: 340 }}>
                <label htmlFor="newStatusSelect" style={{ fontSize: 11, color: "#888" }}>Change status to</label>
                <select
                  id="newStatusSelect"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ProposalStatus)}
                  style={{ ...inlineInput, width: "100%" }}
                >
                  {statusTransitions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                {newStatus === "Rejected" && (
                  <input
                    placeholder="Rejection reason (required)"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    style={{ ...inlineInput, width: "100%" }}
                  />
                )}

                <div style={{ display: "flex", gap: 6 }}>
                  <button
                    type="button"
                    style={btn("rgba(76,175,80,0.12)", "rgba(76,175,80,0.35)", "#4caf50")}
                    onClick={handleStatusChange}
                    disabled={busy || (newStatus === "Rejected" && !reason.trim())}
                  >
                    {busy ? "Updating…" : "Confirm"}
                  </button>
                  <button
                    type="button"
                    style={btn("#1e1e1e", "#333", "#888")}
                    onClick={() => { setShowStatus(false); setReason(""); setError(null); }}
                    disabled={busy}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: 13, color: "#555", margin: 0 }}>No active proposal for this client.</p>
        )}
      </div>

      <hr className={card.divider} />

      {/* ══════════════════════════════
          SECTION 2 — Request Pricing
      ══════════════════════════════ */}
      <div style={{ padding: "14px 0 10px" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em",
          textTransform: "uppercase", marginBottom: 10 }}>
          Pricing
        </div>

        {showPricing ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "10px 14px",
            background: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: 8, maxWidth: 380 }}>
            <label htmlFor="repSelect" style={{ fontSize: 11, color: "#888" }}>Assign to Sales Rep</label>
            <select
              id="repSelect"
              value={repId}
              onChange={(e) => setRepId(e.target.value)}
              style={{ ...inlineInput, width: "100%" }}
            >
              <option value="">— Select rep —</option>
              {salesReps.map((rep) => (
                <option key={rep.id} value={rep.id ?? ""}>
                  {rep.firstName} {rep.lastName}
                </option>
              ))}
            </select>

            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label htmlFor="prioritySelect" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Priority</label>
                <select
                  id="prioritySelect"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  style={{ ...inlineInput, width: "100%" }}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label htmlFor="reqByInput" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Required by</label>
                <input
                  id="reqByInput"
                  type="date"
                  value={reqByDate}
                  onChange={(e) => setReqByDate(e.target.value)}
                  style={{ ...inlineInput, width: "100%" }}
                />
              </div>
            </div>

            <div>
              <label htmlFor="pricingNotesInput" style={{ fontSize: 11, color: "#888", display: "block", marginBottom: 4 }}>Notes (optional)</label>
              <textarea
                id="pricingNotesInput"
                value={pricingNotes}
                onChange={(e) => setPricingNotes(e.target.value)}
                rows={2}
                placeholder="Additional context for the rep…"
                style={{ ...inlineInput, width: "100%", resize: "vertical" }}
              />
            </div>

            <div style={{ display: "flex", gap: 6 }}>
              <button
                type="button"
                style={btn("rgba(245,166,35,0.12)", "rgba(245,166,35,0.35)", "#f5a623")}
                onClick={handleRequestPricing}
                disabled={busy || !repId}
              >
                {busy ? "Submitting…" : "Submit Request"}
              </button>
              <button
                type="button"
                style={btn("#1e1e1e", "#333", "#888")}
                onClick={() => { setShowPricing(false); setError(null); }}
                disabled={busy}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            style={btn("rgba(245,166,35,0.1)", "rgba(245,166,35,0.35)", "#f5a623")}
            onClick={() => { setShowPricing(true); setError(null); }}
          >
            <DollarOutlined style={{ fontSize: 11 }} /> Request Pricing
          </button>
        )}
      </div>

      {/* ══════════════════════════════
          SECTION 3 — Expiring Contracts (managers only)
      ══════════════════════════════ */}
      {canManage && expiringContracts.length > 0 && (
        <>
          <hr className={card.divider} />
          <div style={{ padding: "14px 0 6px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#555", letterSpacing: "0.06em",
              textTransform: "uppercase", marginBottom: 10 }}>
              Expiring Contracts
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {expiringContracts.map((c) => (
                <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 13, color: "#ccc", flex: 1 }}>{c.title}</span>
                  {c.daysUntilExpiry !== undefined && (
                    <span style={{ fontSize: 11, color: "#f5a623",
                      background: "rgba(245,166,35,0.1)", border: "1px solid rgba(245,166,35,0.25)",
                      borderRadius: 20, padding: "1px 8px" }}>
                      {c.daysUntilExpiry}d left
                    </span>
                  )}
                  <Link
                    href={`/contracts/${c.id}/createRenewal?clientId=${clientId}`}
                    style={btn("rgba(92,107,192,0.1)", "rgba(92,107,192,0.35)", "#9aa0dc")}
                    title="Renew this contract"
                  >
                    <ReloadOutlined style={{ fontSize: 10 }} /> Renew
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
