"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckOutlined, CloseOutlined, SendOutlined, DeleteOutlined,
  RightOutlined, DownOutlined, CheckCircleFilled,
} from "@ant-design/icons";
import { message, Spin } from "antd";
import api from "../../../../lib/utils/axiosInstance";
import { useCardStyles } from "../card/card.module";
import { useClientProposalsStyles } from "./clientProposals.module";
import type { IProposal, IProposalLineItem, IActivity } from "../../../../lib/providers/context";
import type { ProposalStatus } from "../../../../lib/utils/apiEnums";
import { useUserState, useProposalAction } from "../../../../lib/providers/provider";

interface ClientProposalsProps {
  proposals:    IProposal[];
  isPending:    boolean;
  isError:      boolean;
  clientId:     string;
  createHref:   string;
}

/* ── Helpers ── */

/** Parses "[LI:{uuid}] some text" and returns the uuid, or null */
function extractLineItemIdFromSubject(subject: string): string | null {
  const m = subject.match(/^\[LI:([^\]]+)\]/);
  return m ? m[1] : null;
}

const STATUS_KEY: Record<ProposalStatus, string> = {
  Draft:     "draft",
  Submitted: "submitted",
  Approved:  "approved",
  Rejected:  "rejected",
};

function fmt(iso?: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric", month: "short", day: "numeric",
  });
}

function isExpired(iso?: string) {
  if (!iso) return false;
  return new Date(iso) < new Date();
}

/** Returns true when the user has Admin or SalesManager role */
function canManageProposals(role?: string, roles?: string[]): boolean {
  const check = (r: string) => r === "Admin" || r === "SalesManager";
  if (role && check(role)) return true;
  return roles?.some(check) ?? false;
}

export default function ClientProposals({
  proposals,
  isPending,
  isError,
  clientId,
  createHref,
}: Readonly<ClientProposalsProps>) {
  const { styles: card, cx } = useCardStyles();
  const { styles }           = useClientProposalsStyles();
  const { user }             = useUserState();
  const proposalActions      = useProposalAction();

  const canManage = canManageProposals(user?.role, user?.roles);

  const [actingId, setActingId]       = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  /* ── Expandable line-item row ── */
  const [expandedId, setExpandedId] = useState<string | null>(null);
  type LineItemDetail = {
    lineItems:        IProposalLineItem[];
    completedLineIds: Set<string>;
    loading:          boolean;
  };
  const [detailsCache, setDetailsCache] = useState<Record<string, LineItemDetail>>({});

  const fetchProposalDetails = useCallback(async (proposalId: string) => {
    // Already loaded — skip
    if (detailsCache[proposalId] && !detailsCache[proposalId].loading) return;

    setDetailsCache(prev => ({ ...prev, [proposalId]: { lineItems: [], completedLineIds: new Set(), loading: true } }));
    try {
      const [proposalRes, activitiesRes] = await Promise.allSettled([
        api.get<IProposal>(`/proposals/${proposalId}`),
        // TODO: verify the API actually supports relatedToType + relatedToId filters
        api.get<{ data?: IActivity[]; items?: IActivity[] } | IActivity[]>(
          "/activities",
          { params: { relatedToType: 3, relatedToId: proposalId, pageSize: 100 } }
        ),
      ]);

      const lineItems: IProposalLineItem[] =
        proposalRes.status === "fulfilled"
          ? (proposalRes.value.data as IProposal).lineItems ?? []
          : [];

      const completedLineIds = new Set<string>();
      if (activitiesRes.status === "fulfilled") {
        const raw = activitiesRes.value.data;
        const acts: IActivity[] = Array.isArray(raw)
          ? raw
          : (raw as { data?: IActivity[]; items?: IActivity[] }).data ??
            (raw as { data?: IActivity[]; items?: IActivity[] }).items ?? [];
        for (const act of acts) {
          if (act.status === "Completed" && act.subject) {
            const liId = extractLineItemIdFromSubject(act.subject);
            if (liId) completedLineIds.add(liId);
          }
        }
      }

      setDetailsCache(prev => ({
        ...prev,
        [proposalId]: { lineItems, completedLineIds, loading: false },
      }));
    } catch {
      message.error("Failed to load proposal details");
      setDetailsCache(prev => ({ ...prev, [proposalId]: { lineItems: [], completedLineIds: new Set(), loading: false } }));
    }
  }, [detailsCache]);

  function toggleExpand(proposalId: string) {
    if (expandedId === proposalId) {
      setExpandedId(null);
    } else {
      setExpandedId(proposalId);
      fetchProposalDetails(proposalId);
    }
  }

  async function handleStatusChange(proposalId: string, newStatus: ProposalStatus, reason?: string) {
    setActingId(proposalId);
    setActionError(null);
    try {
      await proposalActions.updateStatus(proposalId, newStatus, clientId, reason);
    } catch {
      setActionError(`Failed to change status to ${newStatus}.`);
    } finally {
      setActingId(null);
    }
  }

  async function handleDelete(proposalId: string) {
    if (!globalThis.confirm("Delete this draft proposal? This cannot be undone.")) return;
    setActingId(proposalId);
    setActionError(null);
    try {
      await proposalActions.deleteProposal(proposalId, clientId);
    } catch {
      setActionError("Failed to delete proposal.");
    } finally {
      setActingId(null);
    }
  }

  return (
    <div className={card.card}>
      {/* Header */}
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Proposal History</h3>
      </div>

      <hr className={card.divider} />

      {/* Action error */}
      {actionError && (
        <div style={{
          margin: "8px 0",
          padding: "8px 14px",
          background: "rgba(244,67,54,0.08)",
          border: "1px solid rgba(244,67,54,0.3)",
          borderRadius: 8,
          color: "#f44336",
          fontSize: 12,
        }}>
          {actionError}
        </div>
      )}

      {/* Loading */}
      {isPending && (
        <div className={styles.skeletonWrap}>
          {[1, 2, 3].map((k) => (
            <div key={k} className={styles.skeletonRow}>
              <div className={styles.skeletonBlock} style={{ width: "40%", height: 13 }} />
              <div className={styles.skeletonBlock} style={{ width: "14%", height: 20, borderRadius: 20 }} />
              <div className={styles.skeletonBlock} style={{ width: "12%", height: 13 }} />
              <div className={styles.skeletonBlock} style={{ width: "14%", height: 13 }} />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isPending && isError && (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>⚠</div>
          <p className={styles.emptyTitle}>Failed to load proposals</p>
          <p className={styles.emptySub}>Check your connection and try again.</p>
        </div>
      )}

      {/* Empty state */}
      {!isPending && !isError && proposals.length === 0 && (
        <div className={styles.emptyWrap}>
          <div className={styles.emptyIcon}>📄</div>
          <p className={styles.emptyTitle}>No proposals yet</p>
          <p className={styles.emptySub}>
            Select an opportunity above and click <strong>+ Proposal</strong> to create one.
          </p>
        </div>
      )}

      {/* Table */}
      {!isPending && !isError && proposals.length > 0 && (
        <table className={card.table}>
          <thead>
            <tr>
              <th className={card.th} style={{ width: 28 }} />{/* expand toggle */}
              <th className={card.th}>Title</th>
              <th className={card.th}>Status</th>
              <th className={card.th}>Line Items</th>
              <th className={card.th}>Valid Until</th>
              <th className={card.th}>Currency</th>
              <th className={card.th}>Contract</th>
              {canManage && <th className={card.th}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {(Array.isArray(proposals) ? proposals : []).map((p) => {
              const expired   = isExpired(p.validUntil);
              const status    = p.status ?? "Draft";
              const key       = STATUS_KEY[status];
              const itemCount = p.lineItems?.length ?? p.scopeItems?.length ?? 0;
              const isActing  = actingId === p.id;

              const isExpanded = expandedId === p.id;
              const detail     = p.id ? detailsCache[p.id] : undefined;

              return (
                <Fragment key={p.id}>
                <tr>
                  {/* Expand toggle */}
                  <td className={card.td} style={{ width: 28, paddingRight: 0 }}>
                    <button
                      type="button"
                      onClick={() => p.id && toggleExpand(p.id)}
                      style={{
                        background: "none", border: "none", cursor: "pointer",
                        color: "#555", padding: 0, display: "flex", alignItems: "center",
                      }}
                      aria-label={isExpanded ? "Collapse line items" : "Expand line items"}
                    >
                      {isExpanded
                        ? <DownOutlined style={{ fontSize: 10 }} />
                        : <RightOutlined style={{ fontSize: 10 }} />}
                    </button>
                  </td>
                  <td className={cx(card.td, card.tdWhite)}>
                    {p.title || "Untitled"}
                  </td>

                  <td className={card.td}>
                    <span className={cx(styles.badge, styles[key as keyof typeof styles])}>
                      {status}
                    </span>
                  </td>

                  <td className={card.td}>
                    {itemCount > 0
                      ? <span className={styles.lineCount}>{itemCount} item{itemCount === 1 ? "" : "s"}</span>
                      : <span className={styles.lineCountNone}>None</span>
                    }
                  </td>

                  <td className={card.td}>
                    <span className={expired ? styles.dateExpired : styles.dateValid}>
                      {fmt(p.validUntil)}
                    </span>
                  </td>

                  <td className={card.td}>{p.currency}</td>

                  {/* Contract — always visible, active only on Approved proposals */}
                  <td className={card.td}>
                    {status === "Approved" ? (
                      <Link
                        href={`/contracts/create?clientId=${clientId}&opportunityId=${p.opportunityId}&proposalId=${p.id ?? ""}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 4,
                          padding: "3px 12px",
                          borderRadius: 16,
                          fontSize: 11,
                          fontWeight: 600,
                          border: "1px solid rgba(92,107,192,0.4)",
                          color: "#9aa0dc",
                          background: "rgba(92,107,192,0.08)",
                          textDecoration: "none",
                        }}
                        title="Create contract from this proposal"
                      >
                        + Contract
                      </Link>
                    ) : (
                      <span style={{ fontSize: 11, color: "#444" }}>—</span>
                    )}
                  </td>

                  {canManage && (
                    <td className={card.td}>
                      <ProposalActions
                        proposalId={p.id ?? ""}
                        status={status}
                        isActing={isActing}
                        onAction={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    </td>
                  )}
                </tr>

                {/* ── Expanded line-item detail row ── */}
                {isExpanded && (
                  <tr>
                    <td
                      colSpan={canManage ? 8 : 7}
                      style={{ padding: 0, background: "#1a1a1a" }}
                    >
                      <div style={{
                        padding: "12px 16px 16px 40px",
                        borderBottom: "1px solid #2a2a2a",
                        borderTop: "1px solid #222",
                      }}>
                        {detail?.loading && (
                          <Spin size="small" style={{ color: "#9aa0dc" }} />
                        )}

                        {!detail?.loading && detail?.lineItems.length === 0 && (
                          <span style={{ fontSize: 12, color: "#555" }}>No line items found.</span>
                        )}

                        {!detail?.loading && (detail?.lineItems.length ?? 0) > 0 && (
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr>
                                {["Product / Service", "Qty", "Unit Price", "Discount", "Tax", "Total", "Status"].map(h => (
                                  <th key={h} style={{
                                    textAlign: "left", padding: "4px 8px",
                                    fontSize: 10, color: "#555", fontWeight: 600,
                                    borderBottom: "1px solid #2a2a2a",
                                  }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {detail!.lineItems.map((li, idx) => {
                                const done = li.id ? detail!.completedLineIds.has(li.id) : false;
                                return (
                                  <tr key={li.id ?? idx}>
                                    <td style={{ padding: "5px 8px", fontSize: 12, color: "#ccc" }}>
                                      {li.productServiceName || "—"}
                                    </td>
                                    <td style={{ padding: "5px 8px", fontSize: 12, color: "#999" }}>{li.quantity}</td>
                                    <td style={{ padding: "5px 8px", fontSize: 12, color: "#999" }}>
                                      ${Number(li.unitPrice).toFixed(2)}
                                    </td>
                                    <td style={{ padding: "5px 8px", fontSize: 12, color: "#999" }}>
                                      {li.discount ? `${li.discount}%` : "—"}
                                    </td>
                                    <td style={{ padding: "5px 8px", fontSize: 12, color: "#999" }}>
                                      {li.taxRate ? `${li.taxRate}%` : "—"}
                                    </td>
                                    <td style={{ padding: "5px 8px", fontSize: 12, color: "#ccc" }}>
                                      {li.lineTotal != null
                                        ? `$${Number(li.lineTotal).toFixed(2)}`
                                        : "—"}
                                    </td>
                                    <td style={{ padding: "5px 8px" }}>
                                      {done ? (
                                        <span style={{
                                          display: "inline-flex", alignItems: "center", gap: 4,
                                          fontSize: 10, fontWeight: 600, color: "#4caf50",
                                          background: "rgba(76,175,80,0.1)",
                                          border: "1px solid rgba(76,175,80,0.35)",
                                          borderRadius: 20, padding: "2px 8px",
                                        }}>
                                          <CheckCircleFilled style={{ fontSize: 9 }} /> Completed
                                        </span>
                                      ) : (
                                        <span style={{ fontSize: 10, color: "#444" }}>Pending</span>
                                      )}
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

/* ── Action buttons sub-component ─────────────────────────────── */

interface ProposalActionsProps {
  proposalId: string;
  status:     ProposalStatus;
  isActing:   boolean;
  onAction:   (id: string, newStatus: ProposalStatus, reason?: string) => void;
  onDelete:   (id: string) => void;
}

const btnBase: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 10px",
  borderRadius: 16,
  fontSize: 11,
  fontWeight: 600,
  border: "1px solid",
  cursor: "pointer",
  transition: "opacity 0.15s",
};

const rejectInput: React.CSSProperties = {
  background: "#1e1e1e", border: "1px solid rgba(244,67,54,0.4)",
  color: "#ccc", borderRadius: 6, padding: "4px 8px", fontSize: 11, outline: "none",
};

function ProposalActions({ proposalId, status, isActing, onAction, onDelete }: Readonly<ProposalActionsProps>) {
  const [showReason, setShowReason] = useState(false);
  const [reason, setReason]         = useState("");

  if (isActing) {
    return <span style={{ fontSize: 11, color: "#888" }}>Updating…</span>;
  }

  if (status === "Draft") {
    return (
      <span style={{ display: "inline-flex", gap: 6 }}>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(92,107,192,0.12)", borderColor: "rgba(92,107,192,0.35)", color: "#9aa0dc" }}
          onClick={() => onAction(proposalId, "Submitted")}
          title="Mark as Submitted"
        >
          <SendOutlined style={{ fontSize: 10 }} /> Submit
        </button>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(244,67,54,0.08)", borderColor: "rgba(244,67,54,0.3)", color: "#f44336" }}
          onClick={() => onDelete(proposalId)}
          title="Delete draft proposal"
        >
          <DeleteOutlined style={{ fontSize: 10 }} />
        </button>
      </span>
    );
  }

  if (status === "Submitted") {
    if (showReason) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 200 }}>
          <input
            placeholder="Rejection reason (required)"
            value={reason}
            onChange={e => setReason(e.target.value)}
            style={rejectInput}
          />
          <span style={{ display: "inline-flex", gap: 6 }}>
            <button
              type="button"
              disabled={!reason.trim()}
              style={{ ...btnBase, background: "rgba(244,67,54,0.08)", borderColor: "rgba(244,67,54,0.3)", color: "#f44336",
                opacity: reason.trim() ? 1 : 0.45, cursor: reason.trim() ? "pointer" : "not-allowed" }}
              onClick={() => { onAction(proposalId, "Rejected", reason); setShowReason(false); setReason(""); }}
            >
              Confirm Reject
            </button>
            <button
              type="button"
              style={{ ...btnBase, background: "#1e1e1e", borderColor: "#333", color: "#888" }}
              onClick={() => { setShowReason(false); setReason(""); }}
            >
              Cancel
            </button>
          </span>
        </div>
      );
    }

    return (
      <span style={{ display: "inline-flex", gap: 6 }}>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(76,175,80,0.1)", borderColor: "rgba(76,175,80,0.35)", color: "#4caf50" }}
          onClick={() => onAction(proposalId, "Approved")}
          title="Approve proposal"
        >
          <CheckOutlined style={{ fontSize: 10 }} /> Approve
        </button>
        <button
          type="button"
          style={{ ...btnBase, background: "rgba(244,67,54,0.08)", borderColor: "rgba(244,67,54,0.3)", color: "#f44336" }}
          onClick={() => setShowReason(true)}
          title="Reject proposal"
        >
          <CloseOutlined style={{ fontSize: 10 }} /> Reject
        </button>
      </span>
    );
  }

  /* Rejected — terminal, no further action */
  return <span style={{ fontSize: 11, color: "#555" }}>—</span>;
}
