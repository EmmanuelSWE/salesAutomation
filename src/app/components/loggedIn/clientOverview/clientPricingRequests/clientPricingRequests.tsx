"use client";

import { useEffect } from "react";
import { ClockCircleOutlined } from "@ant-design/icons";
import { useCardStyles } from "../card/card.module";
import {
  usePricingRequestState,
  usePricingRequestAction,
  useUserState,
  useUserAction,
} from "../../../../lib/providers/provider";
import type { IPricingRequest } from "../../../../lib/providers/context";
import type { Priority, PricingRequestStatus } from "../../../../lib/utils/apiEnums";

interface Props {
  opportunityId?: string;
  clientId:       string;
}

const PRIORITY_COLOR: Record<Priority, string> = {
  Low:    "#29b6f6",
  Medium: "#f5a623",
  High:   "#ff7043",
  Urgent: "#ef5350",
};

const STATUS_STYLE: Record<PricingRequestStatus, { bg: string; color: string }> = {
  "Pending":     { bg: "rgba(120,120,120,0.15)", color: "#999"    },
  "In Progress": { bg: "rgba(92,107,192,0.15)",  color: "#9aa0dc" },
  "Completed":   { bg: "rgba(38,166,154,0.15)",  color: "#26a69a" },
};

const formatDate = (iso?: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
};

export default function ClientPricingRequests({ opportunityId, clientId }: Readonly<Props>) {
  const { styles: card } = useCardStyles();

  const { pricingRequests, isPending, isError } = usePricingRequestState();
  const { getPricingRequests }                   = usePricingRequestAction();
  const { users }                                = useUserState();
  const { getUsers }                             = useUserAction();

  /* Load users for display names */
  useEffect(() => { getUsers({ isActive: true }); }, []); // eslint-disable-line

  /* Fetch pricing requests for this client's opportunity */
  useEffect(() => {
    getPricingRequests(opportunityId ? { opportunityId } : {});
  }, [opportunityId]); // eslint-disable-line

  /* Client-side filter: only show requests tied to this opportunity */
  const requests: IPricingRequest[] = opportunityId
    ? (pricingRequests ?? []).filter(
        (r) => !r.opportunityId || r.opportunityId === opportunityId
      )
    : (pricingRequests ?? []);

  function getUserName(id?: string): string {
    if (!id || !users) return "Unassigned";
    const u = users.find((x) => x.id === id);
    return u ? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() : "Unknown";
  }

  return (
    <div className={card.card}>
      <div className={card.cardHeader}>
        <h3 className={card.cardTitle}>Pricing Requests</h3>
      </div>
      <hr className={card.divider} />

      {/* States */}
      {isPending && (
        <p style={{ color: "#666", fontSize: 13, padding: "12px 0" }}>Loading pricing requests…</p>
      )}
      {isError && !isPending && (
        <p style={{ color: "#ef5350", fontSize: 13, padding: "12px 0" }}>
          Failed to load pricing requests.
        </p>
      )}
      {!isPending && !isError && requests.length === 0 && (
        <p style={{ color: "#555", fontSize: 13, padding: "12px 0" }}>
          No pricing requests for this client.
        </p>
      )}

      {/* List */}
      {!isPending && requests.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
          {requests.map((req) => {
            const statusStyle = STATUS_STYLE[req.status ?? "Pending"] ?? STATUS_STYLE["Pending"];
            const isDone      = req.status === "Completed";
            return (
              <div
                key={req.id}
                style={{
                  display:         "flex",
                  alignItems:      "flex-start",
                  justifyContent:  "space-between",
                  gap:             12,
                  padding:         "10px 14px",
                  background:      "#1e1e1e",
                  border:          "1px solid #2a2a2a",
                  borderRadius:    8,
                  opacity:         isDone ? 0.72 : 1,
                }}
              >
                {/* info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: "#e0e0e0", marginBottom: 6 }}>
                    {req.title}
                  </div>
                  {req.description && (
                    <div style={{
                      fontSize: 12, color: "#777", marginBottom: 6,
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {req.description}
                    </div>
                  )}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                    {/* Status */}
                    <span style={{
                      padding: "2px 8px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                      background: statusStyle.bg, color: statusStyle.color,
                    }}>
                      {req.status ?? "Pending"}
                    </span>

                    {/* Priority */}
                    {req.priority && (
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        color: PRIORITY_COLOR[req.priority] ?? "#888",
                      }}>
                        {req.priority}
                      </span>
                    )}

                    {/* Required by */}
                    {req.requiredByDate && (
                      <span style={{ fontSize: 11, color: "#666", display: "flex", alignItems: "center", gap: 3 }}>
                        <ClockCircleOutlined style={{ fontSize: 10 }} />
                        Due {formatDate(req.requiredByDate)}
                      </span>
                    )}

                    {/* Assigned to */}
                    <span style={{ fontSize: 11, color: "#666" }}>
                      → {getUserName(req.assignedToId)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
