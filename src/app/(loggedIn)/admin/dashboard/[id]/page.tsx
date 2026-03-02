"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeftOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
  FundOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../../../../lib/utils/axiosInstance";
import { OPPORTUNITY_STAGE_NUM as _OPPORTUNITY_STAGE_NUM } from "../../../../lib/utils/apiEnums"; // eslint-disable-line @typescript-eslint/no-unused-vars

/* ── inverse of OPPORTUNITY_STAGE_NUM ── */
const STAGE_LABEL: Record<number, string> = {
  1: "Prospecting", 2: "Qualification", 3: "Proposal",
  4: "Negotiation",  5: "Closed Won",   6: "Closed Lost",
};
const STAGE_COLOR: Record<number, string> = {
  1: "#5c6bc0", 2: "#f5a623", 3: "#29b6f6",
  4: "#ab47bc",  5: "#4caf50", 6: "#ef5350",
};
const PRIORITY_COLOR: Record<string, string> = {
  Low: "#29b6f6", Medium: "#f5a623", High: "#ff7043", Urgent: "#ef5350",
  1: "#29b6f6", 2: "#f5a623", 3: "#ff7043", 4: "#ef5350",
} as unknown as Record<string, string>;
const ACTIVITY_STATUS_COLOR: Record<string, string> = {
  Scheduled:  "#9aa0dc", Completed: "#4caf50", Cancelled: "#ef5350",
  0: "#999", 1: "#9aa0dc", 2: "#4caf50", 3: "#ef5350",
} as unknown as Record<string, string>;

/* ── helpers ── */
function fmtDate(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  return Number.isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
function fmtCurrency(n?: number) {
  if (n == null) return "—";
  return `$${n.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}
function normalize(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    const d = data as Record<string, unknown>;
    for (const key of ["items", "data", "value", "results"]) {
      if (Array.isArray(d[key])) return d[key] as unknown[];
    }
  }
  return [];
}

/* ── card style preset ── */
const card: React.CSSProperties = {
  background: "#1e1e1e", border: "1px solid #2a2a2a",
  borderRadius: 12, padding: "18px 20px",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#555",
  letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 12,
};

/* ── KPI card ── */
function KpiCard({ icon, label, value, color }: Readonly<{
  icon: React.ReactNode; label: string; value: string | number; color: string;
}>) {
  return (
    <div style={{ ...card, display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center",
        justifyContent: "center", fontSize: 17, background: `${color}22`, color,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

/* ── Role badge ── */
const ROLE_LABEL: Record<string, string> = {
  SalesRep: "Sales Rep", BusinessDevelopmentManager: "BDM",
  SalesManager: "Sales Manager", Admin: "Admin",
};

export default function RepDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  /* ── rep info ── */
  const [rep, setRep]   = useState<Record<string, unknown> | null>(null);
  const [repErr, setRepErr] = useState(false);

  /* ── data slices ── */
  const [activities,      setActivities]      = useState<Record<string, unknown>[]>([]);
  const [opportunities,   setOpportunities]   = useState<Record<string, unknown>[]>([]);
  const [pricingRequests, setPricingRequests] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    Promise.allSettled([
      api.get(`/users/${id}`),
      api.get("/activities",      { params: { assignedToId: id, pageSize: 50  } }),
      api.get("/opportunities",   { params: { ownerId:      id, pageSize: 100 } }),
      api.get("/pricingrequests", { params: { assignedToId: id, pageSize: 50  } }),
    ]).then(([repRes, actRes, oppRes, prRes]) => {
      if (repRes.status === "fulfilled") setRep(repRes.value.data);
      else setRepErr(true);

      if (actRes.status === "fulfilled")
        setActivities(normalize(actRes.value.data) as Record<string, unknown>[]);
      if (oppRes.status === "fulfilled")
        setOpportunities(normalize(oppRes.value.data) as Record<string, unknown>[]);
      if (prRes.status === "fulfilled")
        setPricingRequests(normalize(prRes.value.data) as Record<string, unknown>[]);
    }).finally(() => setLoading(false));
  }, [id]);

  /* ── KPI computations ── */
  const openOpps      = opportunities.filter((o) => {
    const s = Number(o.stage);
    return s >= 1 && s <= 4;
  });
  const scheduledActs = activities.filter((a) => {
    const s = String((a.status as string | number | null | undefined) ?? "");
    return s === "Scheduled" || s === "1";
  });
  const completedActs = activities.filter((a) => {
    const s = String((a.status as string | number | null | undefined) ?? "");
    return s === "Completed" || s === "2";
  });
  const overdueActs   = activities.filter((a) => {
    if (!a.dueDate) return false;
    const s = String((a.status as string | number | null | undefined) ?? "");
    if (s === "Completed" || s === "Cancelled" || s === "2" || s === "3") return false;
    return new Date(a.dueDate as string) < new Date();
  });
  const openPRCount = pricingRequests.filter((r) => {
    const s = String((r.status as string | number | null | undefined) ?? "");
    return s !== "Completed";
  }).length;

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div style={{ padding: "24px 28px", background: "#1a1a1a", minHeight: "100vh" }}>
        <div style={{ height: 24, background: "#2e2e2e", borderRadius: 8, width: 220, marginBottom: 32, opacity: 0.5 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {[1,2,3,4].map((k) => (
            <div key={k} style={{ ...card, height: 80, opacity: 0.4 }} />
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ ...card, height: 300, opacity: 0.4 }} />
          <div style={{ ...card, height: 300, opacity: 0.4 }} />
        </div>
      </div>
    );
  }

  if (repErr || !rep) {
    return (
      <div style={{ padding: "24px 28px", background: "#1a1a1a", minHeight: "100vh", color: "#ef5350" }}>
        <button type="button" onClick={() => router.back()}
          style={{ background: "none", border: "none", color: "#888", cursor: "pointer", marginBottom: 24, display: "flex", alignItems: "center", gap: 6 }}>
          <ArrowLeftOutlined /> Back
        </button>
        <p>Could not load rep profile.</p>
      </div>
    );
  }

  const repName  = `${(rep.firstName as string) ?? ""} ${(rep.lastName as string) ?? ""}`.trim() || "Unknown";
  const repRole  = ROLE_LABEL[rep.role as string] ?? (rep.role as string) ?? "User";
  const initials = repName.split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  /* Latest 6 activities, sorted by dueDate desc */
  const recentActs = [...activities]
    .sort((a, b) => new Date(b.dueDate as string ?? 0).getTime() - new Date(a.dueDate as string ?? 0).getTime())
    .slice(0, 6);

  /* Open opps sorted by value desc */
  const topOpps = [...openOpps]
    .sort((a, b) => Number(b.estimatedValue ?? 0) - Number(a.estimatedValue ?? 0))
    .slice(0, 6);

  return (
    <div style={{
      padding: "24px 28px", background: "#1a1a1a", minHeight: "100vh",
      boxSizing: "border-box", display: "flex", flexDirection: "column", gap: 20,
    }}>
      {/* ── Back button ── */}
      <button type="button" onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "#888", cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, alignSelf: "flex-start" }}>
        <ArrowLeftOutlined /> Dashboard
      </button>

      {/* ── Rep header ── */}
      <div style={{ ...card, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{
          width: 56, height: 56, borderRadius: "50%", background: "#5c6bc0",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "#fff", flexShrink: 0,
        }}>
          {initials || <UserOutlined />}
        </div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 700, color: "#fff" }}>{repName}</div>
          <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>
            {repRole}
            {rep.email ? ` · ${rep.email as string}` : ""}
          </div>
        </div>
        <div style={{ marginLeft: "auto", fontSize: 12, color: rep.isActive ? "#4caf50" : "#888" }}>
          {rep.isActive ? "● Active" : "● Inactive"}
        </div>
      </div>

      {/* ── KPIs ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <KpiCard icon={<FundOutlined />}             label="Open Opportunities"  value={openOpps.length}      color="#5c6bc0" />
        <KpiCard icon={<CalendarOutlined />}         label="Scheduled Activities" value={scheduledActs.length} color="#29b6f6" />
        <KpiCard icon={<CheckCircleOutlined />}      label="Completed Activities" value={completedActs.length} color="#4caf50" />
        <KpiCard icon={<ExclamationCircleOutlined />} label="Overdue Activities"  value={overdueActs.length}   color="#ef5350" />
      </div>

      {/* ── Opportunities + Activities ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>

        {/* Open Opportunities */}
        <div style={card}>
          <div style={sectionTitle}>
            <FundOutlined style={{ marginRight: 6 }} />
            Open Opportunities ({openOpps.length})
          </div>
          {topOpps.length === 0 ? (
            <p style={{ color: "#555", fontSize: 13 }}>No open opportunities.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {topOpps.map((opp) => {
                const stage      = Number(opp.stage);
                const stageLabel = STAGE_LABEL[stage] ?? `Stage ${stage}`;
                const stageColor = STAGE_COLOR[stage] ?? "#888";
                return (
                  <div key={opp.id as string} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 10px", background: "#252525", borderRadius: 8,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: "#e0e0e0",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {(opp.title as string) || "Untitled"}
                      </div>
                      <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
                        Close {fmtDate(opp.expectedCloseDate as string)}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4, flexShrink: 0 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600,
                        padding: "2px 8px", borderRadius: 20,
                        background: `${stageColor}22`, color: stageColor,
                      }}>
                        {stageLabel}
                      </span>
                      <span style={{ fontSize: 12, color: "#999" }}>
                        {fmtCurrency(opp.estimatedValue as number)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Activities */}
        <div style={card}>
          <div style={sectionTitle}>
            <CalendarOutlined style={{ marginRight: 6 }} />
            Recent Activities ({activities.length})
          </div>
          {recentActs.length === 0 ? (
            <p style={{ color: "#555", fontSize: 13 }}>No activities found.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {recentActs.map((act) => {
                const statusStr   = String((act.status as string | number | null | undefined) ?? "");
                const statusColor = ACTIVITY_STATUS_COLOR[statusStr] ?? "#888";
                const isOverdue   = act.dueDate &&
                  statusStr !== "Completed" && statusStr !== "Cancelled" &&
                  statusStr !== "2" && statusStr !== "3" &&
                  new Date(act.dueDate as string) < new Date();
                const statusLabel =
                  statusStr === "1" ? "Scheduled" :
                  statusStr === "2" ? "Completed" :
                  statusStr === "3" ? "Cancelled" :
                  statusStr || "—";
                return (
                  <div key={act.id as string} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                    padding: "8px 10px", background: "#252525", borderRadius: 8,
                  }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{
                        fontSize: 13, fontWeight: 600, color: "#e0e0e0",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {(act.subject as string) || "Untitled"}
                      </div>
                      <div style={{ fontSize: 11, color: !!isOverdue ? "#ef5350" : "#666", marginTop: 2, display: "flex", alignItems: "center", gap: 4 }}>
                        {!!isOverdue && <ExclamationCircleOutlined style={{ fontSize: 10 }} />}
                        <ClockCircleOutlined style={{ fontSize: 10 }} />
                        {fmtDate(act.dueDate as string)}
                      </div>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 600, flexShrink: 0,
                      padding: "2px 8px", borderRadius: 20,
                      background: `${statusColor}22`, color: statusColor,
                    }}>
                      {statusLabel}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Pricing Requests ── */}
      {pricingRequests.length > 0 && (
        <div style={card}>
          <div style={sectionTitle}>
            <TeamOutlined style={{ marginRight: 6 }} />
            Pricing Requests ({pricingRequests.length})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 10 }}>
            {pricingRequests.slice(0, 9).map((pr) => {
              const status    = String((pr.status as string | null | undefined) ?? "Pending");
              const isDone    = status === "Completed";
              const prioStr   = String((pr.priority as string | number | null | undefined) ?? "Medium");
              const prioColor = PRIORITY_COLOR[prioStr] ?? "#f5a623";
              return (
                <div key={pr.id as string} style={{
                  padding: "10px 12px", background: "#252525", borderRadius: 8,
                  opacity: isDone ? 0.65 : 1,
                }}>
                  <div style={{
                    fontSize: 13, fontWeight: 600, color: "#e0e0e0",
                    marginBottom: 4,
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>
                    {(pr.title as string) || "Untitled"}
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span style={{
                      fontSize: 11, padding: "2px 8px", borderRadius: 20, fontWeight: 600,
                      background: isDone ? "rgba(38,166,154,0.15)" : "rgba(120,120,120,0.15)",
                      color:      isDone ? "#26a69a"               : "#999",
                    }}>
                      {status}
                    </span>
                    <span style={{ fontSize: 11, color: prioColor, fontWeight: 600 }}>
                      {prioStr}
                    </span>
                    {!!pr.requiredByDate && (
                      <span style={{ fontSize: 11, color: "#666" }}>
                        Due {fmtDate(pr.requiredByDate as string)}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
