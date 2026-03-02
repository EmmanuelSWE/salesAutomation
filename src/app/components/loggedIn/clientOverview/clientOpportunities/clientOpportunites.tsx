"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { DeleteOutlined, UserAddOutlined, SwapOutlined } from "@ant-design/icons";
import { useCardStyles } from "../card/card.module";
import { useClientOpportunitiesStyles } from "./clientOpportunites.module";
import {
  useUserState,
  useUserAction,
  useOpportunityAction,
} from "../../../../lib/providers/provider";
import type { IUser } from "../../../../lib/providers/context";

export interface OpportunityRow {
  id:        string;
  title:     string;
  stage:     string;
  value:     string;
  closeDate: string;
}

type Period = "Month" | "Year" | "All Time";

interface ClientOpportunitiesProps {
  opportunities:      OpportunityRow[];
  clientId:           string;
  defaultPeriod?:     Period;
  createHref:         string;
  createProposalHref: (opportunityId: string) => string;
}

const STAGE_NUM: Record<string, number> = {
  "Lead": 1,
  "Qualified": 2,
  "Proposal": 3,
  "Negotiation": 4,
  "Closed Won": 5,
  "Closed Lost": 6,
};

const ALL_STAGES = [
  "Lead",
  "Qualified",
  "Proposal",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

const STAGE_KEY: Record<string, string> = {
  "Lead":        "lead",
  "Qualified":   "qualified",
  "Proposal":    "proposal",
  "Negotiation": "negotiation",
  "Closed Won":  "closedWon",
  "Closed Lost": "closedLost",
};

function isManager(role?: string, roles?: string[]): boolean {
  const check = (r: string) => r === "Admin" || r === "SalesManager";
  if (role && check(role)) return true;
  return roles?.some(check) ?? false;
}

function btnSm(bg: string, border: string, color: string): React.CSSProperties {
  return {
    display: "inline-flex",
    alignItems: "center",
    gap: 4,
    padding: "3px 10px",
    borderRadius: 16,
    fontSize: 11,
    fontWeight: 600,
    background: bg,
    border: `1px solid ${border}`,
    color,
    cursor: "pointer",
    transition: "opacity 0.15s",
  };
}

const inlineSelect: React.CSSProperties = {
  background: "#1e1e1e",
  border: "1px solid #333",
  color: "#ccc",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 11,
  outline: "none",
  width: "100%",
};

const inlineInput: React.CSSProperties = {
  background: "#1e1e1e",
  border: "1px solid #333",
  color: "#ccc",
  borderRadius: 6,
  padding: "4px 8px",
  fontSize: 11,
  outline: "none",
  width: "100%",
};

interface OppActionsProps {
  opportunityId: string;
  clientId:      string;
  currentStage:  string;
  salesReps:     IUser[];
  onDone:        () => void;
}

type ActionMode = "idle" | "stage" | "assign";

function OpportunityActions({
  opportunityId,
  clientId,
  currentStage,
  salesReps,
  onDone,
}: Readonly<OppActionsProps>) {
  const actions                     = useOpportunityAction();
  const [mode, setMode]             = useState<ActionMode>("idle");
  const [stage, setStage]           = useState(currentStage);
  const [notes, setNotes]           = useState("");
  const [lossReason, setLossReason] = useState("");
  const [assignee, setAssignee]     = useState("");
  const [busy, setBusy]             = useState(false);
  const [err, setErr]               = useState<string | null>(null);

  async function doStageChange() {
    const num = STAGE_NUM[stage];
    if (!num) return;
    if (stage === "Closed Lost" && !lossReason.trim()) {
      setErr("Loss reason is required when closing as Lost.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const reason = lossReason.trim() || notes.trim() || undefined;
      await actions.advanceStage(opportunityId, num, reason);
      await actions.getOpportunities({ clientId });
      setMode("idle");
      setNotes("");
      setLossReason("");
      onDone();
    } catch {
      setErr("Stage change failed.");
    } finally {
      setBusy(false);
    }
  }

  async function doAssign() {
    if (!assignee) {
      setErr("Select a rep first.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      await actions.assignOpportunity(opportunityId, assignee);
      setMode("idle");
      setAssignee("");
      onDone();
    } catch {
      setErr("Assign failed.");
    } finally {
      setBusy(false);
    }
  }

  async function doDelete() {
    if (!globalThis.confirm("Delete this opportunity? This cannot be undone.")) return;
    setBusy(true);
    setErr(null);
    try {
      await actions.deleteOpportunity(opportunityId);
      await actions.getOpportunities({ clientId });
      onDone();
    } catch {
      setErr("Delete failed.");
    } finally {
      setBusy(false);
    }
  }

  if (busy) return <span style={{ fontSize: 11, color: "#888" }}>Working...</span>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {err && <span style={{ fontSize: 10, color: "#f44336" }}>{err}</span>}

      {mode === "idle" && (
        <span style={{ display: "inline-flex", gap: 6, flexWrap: "wrap" }}>
          <button
            type="button"
            onClick={() => setMode("stage")}
            style={btnSm("rgba(92,107,192,0.12)", "rgba(92,107,192,0.35)", "#9aa0dc")}
            title="Change stage"
          >
            <SwapOutlined style={{ fontSize: 10 }} /> Stage
          </button>
          <button
            type="button"
            onClick={() => setMode("assign")}
            style={btnSm("rgba(245,166,35,0.1)", "rgba(245,166,35,0.3)", "#f5a623")}
            title="Assign to rep"
          >
            <UserAddOutlined style={{ fontSize: 10 }} /> Assign
          </button>
          <button
            type="button"
            onClick={doDelete}
            style={btnSm("rgba(244,67,54,0.08)", "rgba(244,67,54,0.3)", "#f44336")}
            title="Delete opportunity"
          >
            <DeleteOutlined style={{ fontSize: 10 }} />
          </button>
        </span>
      )}

      {mode === "stage" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 190 }}>
          <select
            value={stage}
            onChange={(e) => setStage(e.target.value)}
            style={inlineSelect}
          >
            {ALL_STAGES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            placeholder="Notes (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={inlineInput}
          />
          {stage === "Closed Lost" && (
            <input
              placeholder="Loss reason (required)"
              value={lossReason}
              onChange={(e) => setLossReason(e.target.value)}
              style={{ ...inlineInput, borderColor: "rgba(244,67,54,0.5)" }}
            />
          )}
          <span style={{ display: "inline-flex", gap: 6 }}>
            <button
              type="button"
              onClick={doStageChange}
              style={btnSm("rgba(76,175,80,0.1)", "rgba(76,175,80,0.35)", "#4caf50")}
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => { setMode("idle"); setErr(null); }}
              style={btnSm("#1e1e1e", "#333", "#888")}
            >
              Cancel
            </button>
          </span>
        </div>
      )}

      {mode === "assign" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 190 }}>
          <select
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
            style={inlineSelect}
          >
            <option value="">Select rep...</option>
            {salesReps.map((u) => (
              <option key={u.id} value={u.id ?? ""}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
          <span style={{ display: "inline-flex", gap: 6 }}>
            <button
              type="button"
              onClick={doAssign}
              style={btnSm("rgba(76,175,80,0.1)", "rgba(76,175,80,0.35)", "#4caf50")}
            >
              Assign
            </button>
            <button
              type="button"
              onClick={() => { setMode("idle"); setErr(null); }}
              style={btnSm("#1e1e1e", "#333", "#888")}
            >
              Cancel
            </button>
          </span>
        </div>
      )}
    </div>
  );
}

export default function ClientOpportunities({
  opportunities,
  clientId,
  defaultPeriod = "Month",
  createHref,
  createProposalHref,
}: Readonly<ClientOpportunitiesProps>) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientOpportunitiesStyles();
  const [period, setPeriod]  = useState<Period>(defaultPeriod);
  const { user, users }      = useUserState();
  const { getUsers }         = useUserAction();
  const oppActions           = useOpportunityAction();

  const canManage = isManager(user?.role, user?.roles);
  const salesReps = users ?? [];

  useEffect(() => {
    if (canManage) getUsers({ role: "SalesRep", isActive: true });
  }, [canManage]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={card.card}>
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Opportunities</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <Link
            href={createHref}
            style={{
              fontSize: 12,
              fontWeight: 600,
              padding: "5px 14px",
              borderRadius: 7,
              background: "#f5a623",
              color: "#1a1000",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            + New Opportunity
          </Link>
          <div className={card.periodTabs}>
            {(["Month", "Year", "All Time"] as Period[]).map((p) => (
              <button
                key={p}
                type="button"
                className={cx(card.periodTab, period === p && card.periodTabActive)}
                onClick={() => setPeriod(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>
      <hr className={card.divider} />

      {opportunities.length === 0 ? (
        <div style={{ padding: "32px 0", textAlign: "center", color: "#555", fontSize: 13 }}>
          No opportunities yet. Click <strong>+ New Opportunity</strong> to add one.
        </div>
      ) : (
        <table className={card.table}>
          <thead>
            <tr>
              <th className={card.th}>Title</th>
              <th className={card.th}>Stage</th>
              <th className={card.th}>Value</th>
              <th className={card.th}>Close Date</th>
              <th className={card.th}>Proposal</th>
              {canManage && <th className={card.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {opportunities.map((opp) => {
              const key = STAGE_KEY[opp.stage] ?? "lead";
              return (
                <tr key={opp.id}>
                  <td className={cx(card.td, card.tdWhite)}>{opp.title}</td>
                  <td className={card.td}>
                    <span className={cx(styles.badge, styles[key as keyof typeof styles])}>
                      {opp.stage}
                    </span>
                  </td>
                  <td className={cx(card.td, card.tdWhite)}>{opp.value}</td>
                  <td className={card.td}>{opp.closeDate}</td>
                  <td className={card.td}>
                    <Link
                      href={createProposalHref(opp.id)}
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: "3px 10px",
                        borderRadius: 6,
                        background: "rgba(76,175,80,0.15)",
                        color: "#4caf50",
                        textDecoration: "none",
                        whiteSpace: "nowrap",
                      }}
                    >
                      + Proposal
                    </Link>
                  </td>
                  {canManage && (
                    <td className={card.td}>
                      <OpportunityActions
                        opportunityId={opp.id}
                        clientId={clientId}
                        currentStage={opp.stage}
                        salesReps={salesReps}
                        onDone={() => oppActions.getOpportunities({ clientId })}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
