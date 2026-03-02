"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Alert,
  Badge,
  Button,
  Skeleton,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import {
  PlusOutlined,
  ReloadOutlined,
  RightOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import api from "../../../lib/utils/axiosInstance";
import {
  KpiSection,
  PipelineSection,
  SalesActivitiesSection,
} from "../../../components/dashboard/sections/sections";
import type {
  DashboardKpis,
  DashboardFunnel,
  DashboardActivities,
  DashboardSalesPerformance,
} from "../../../lib/placeholderdata";

const { Text } = Typography;

/* ══════════════════════════════════════════════════════════════
   LOCAL TYPES — exactly matching documented API response shapes
══════════════════════════════════════════════════════════════ */

interface DashboardOverview {
  opportunities: {
    totalCount:    number;
    activeCount?:  number;
    wonCount:      number;
    pipelineValue: number;
    winRate:       number;
  };
  pipeline: {
    stages:                unknown[];
    weightedPipelineValue: number;
  };
  activities: {
    totalCount:          number;
    upcomingCount:       number;
    overdueCount:        number;
    completedTodayCount: number;
  };
  contracts: {
    totalActiveCount:       number;
    expiringThisMonthCount: number;
    totalContractValue:     number;
  };
  revenue: {
    thisMonth:          number;
    projectedThisYear?: number;
    monthlyTrend:       unknown[]; // TODO: element shape missing in contract
  };
}

interface PipelineStageItem {
  stage:      number;
  stageName:  string;
  count:      number;
  totalValue: number;
}

interface PipelineMetrics {
  stages:                PipelineStageItem[];
  weightedPipelineValue: number;
  conversionRate:        number;
}

interface ActivitiesSummary {
  totalCount:          number;
  upcomingCount:       number;
  overdueCount:        number;
  completedTodayCount: number;
  byType?:             Array<{ type: string; count: number }>;
}

interface ContractExpiring {
  id?:             string;
  title:           string;
  clientName:      string;
  endDate:         string;
  daysUntilExpiry: number;
  isExpiringSoon:  boolean;
}

/* ══════════════════════════════════════════════════════════════
   GENERIC HOOK — manages data / loading / error / refresh
══════════════════════════════════════════════════════════════ */
function useApi<T>(fetcher: () => Promise<T>) {
  const [data, setData]       = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    fetcher()
      .then(setData)
      .catch((e: unknown) => setError((e as { message?: string }).message ?? "Request failed"))
      .finally(() => setLoading(false));
  }, [fetcher]);

  useEffect(() => { refresh(); }, [refresh]);

  return { data, loading, error, refresh };
}

/* ══════════════════════════════════════════════════════════════
   PER-ENDPOINT HOOKS
══════════════════════════════════════════════════════════════ */
function useDashboardOverview() {
  const fetcher = useCallback(
    () => api.get<DashboardOverview>("/dashboard/overview").then((r) => r.data),
    [],
  );
  return useApi(fetcher);
}

function usePipelineMetrics() {
  const fetcher = useCallback(
    () => api.get<PipelineMetrics>("/dashboard/pipeline-metrics").then((r) => r.data),
    [],
  );
  return useApi(fetcher);
}

function useActivitiesSummary() {
  const fetcher = useCallback(
    () => api.get<ActivitiesSummary>("/dashboard/activities-summary").then((r) => r.data),
    [],
  );
  return useApi(fetcher);
}

function useContractsExpiring(days = 30) {
  const fetcher = useCallback(
    () => api.get<ContractExpiring[]>("/dashboard/contracts-expiring", { params: { days } }).then((r) => r.data),
    [days],
  );
  return useApi(fetcher);
}

/* ══════════════════════════════════════════════════════════════
   HELPERS
══════════════════════════════════════════════════════════════ */
function CtaLink({ href, children, warning }: Readonly<{ href: string; children: ReactNode; warning?: boolean }>) {
  return (
    <Link
      href={href}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        fontSize: 13,
        color: warning ? "#faad14" : "#a0a0a0",
        textDecoration: "none",
      }}
    >
      {warning && <WarningOutlined />}
      {children}
      {!warning && <RightOutlined style={{ fontSize: 10 }} />}
    </Link>
  );
}

function fmt(n = 0) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

/* Sales performance has no documented endpoint — use empty fallback so the doughnut chart renders gracefully */
const FALLBACK_SALES: DashboardSalesPerformance = {
  reps:   [],
  colors: ["#f5a623", "#03a9f4", "#4caf50", "#9e9e9e", "#e91e63"],
};

function PanelSkeleton({ rows = 3, height = 180 }: Readonly<{ rows?: number; height?: number }>) {
  return (
    <div style={{ background: "#232323", borderRadius: 14, padding: 16, minHeight: height }}>
      <Skeleton active paragraph={{ rows }} />
    </div>
  );
}

function PanelError({ message, onRetry }: Readonly<{ message: string; onRetry: () => void }>) {
  return (
    <Alert
      type="error"
      message={message}
      action={
        <Button size="small" onClick={onRetry} icon={<ReloadOutlined />}>
          Retry
        </Button>
      }
      style={{ borderRadius: 10 }}
    />
  );
}

/* ══════════════════════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════════════════════ */
export default function DashboardPage() {
  const router   = useRouter();
  const overview = useDashboardOverview();
  const pipeline = usePipelineMetrics();
  const actSum   = useActivitiesSummary();
  const expiring = useContractsExpiring(30);

  /* ── Map overview → DashboardKpis ──────────────────────────── */
  const kpis: DashboardKpis = overview.data
    ? {
        totalOpportunities: overview.data.opportunities.totalCount,
        wonCount:           overview.data.opportunities.wonCount,
        winRate:            overview.data.opportunities.winRate,
        pipelineValue:      overview.data.opportunities.pipelineValue,
        activeContracts:    overview.data.contracts.totalActiveCount,
        expiringThisMonth:  overview.data.contracts.expiringThisMonthCount,
      }
    : { totalOpportunities: 0, wonCount: 0, winRate: 0, pipelineValue: 0, activeContracts: 0, expiringThisMonth: 0 };

  /* ── Map pipeline-metrics.stages → DashboardFunnel.roles ───── */
  const funnel: DashboardFunnel = pipeline.data
    ? {
        roles: pipeline.data.stages.map((s) => ({
          role:    s.stageName,
          revenue: s.totalValue,
          deals:   s.count,
        })),
      }
    : { roles: [] };

  /* ── Map activities-summary → DashboardActivities ───────────── */
  const activities: DashboardActivities = actSum.data
    ? {
        upcoming:       actSum.data.upcomingCount,
        overdue:        actSum.data.overdueCount,
        completedToday: actSum.data.completedTodayCount,
        labels:  ["Upcoming", "Overdue", "Completed Today"],
        data:    [actSum.data.upcomingCount, actSum.data.overdueCount, actSum.data.completedTodayCount],
        colors:  ["#2979ff", "#ef5350", "#4caf50"],
        center:      `${actSum.data.totalCount}`,
        centerLabel: "Total",
      }
    : { upcoming: 0, overdue: 0, completedToday: 0, labels: [], data: [], colors: [], center: "0", centerLabel: "Total" };

  /* ── Contracts-expiring table columns ───────────────────────── */
  const expiringColumns = [
    {
      title: "Contract",
      dataIndex: "title" as const,
      key: "title",
      render: (v: string) => <Text style={{ color: "#e0e0e0" }}>{v}</Text>,
    },
    {
      title: "Client",
      dataIndex: "clientName" as const,
      key: "client",
      render: (v: string) => <Text style={{ color: "#a0a0a0" }}>{v}</Text>,
    },
    {
      title: "End Date",
      dataIndex: "endDate" as const,
      key: "endDate",
      render: (v: string) => new Date(v).toLocaleDateString(),
    },
    {
      title: "Days Left",
      dataIndex: "daysUntilExpiry" as const,
      key: "days",
      render: (d: number, row: ContractExpiring) => (
        <Tag color={row.isExpiringSoon ? "orange" : "default"}>{d}d</Tag>
      ),
    },
  ];

  const anyLoading = overview.loading || pipeline.loading || actSum.loading || expiring.loading;

  function handleRefreshAll() {
    overview.refresh();
    pipeline.refresh();
    actSum.refresh();
    expiring.refresh();
    router.refresh();
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* ── Header row ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 10px 0" }}>
        <h2 style={{ margin: 0, fontWeight: 600, fontSize: 20, color: "#f0f0f0" }}>Dashboard</h2>
        <Space>
          <Tooltip title="Refresh all panels">
            <Button
              icon={<ReloadOutlined spin={anyLoading} />}
              onClick={handleRefreshAll}
            />
          </Tooltip>
          <Link href="/Client/createClient">
            <Button type="primary" icon={<PlusOutlined />}>New Client</Button>
          </Link>
        </Space>
      </div>

      {/* ── KPI cards ── */}
      <div style={{ padding: "0 10px" }}>
        {overview.loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
            {[0, 1, 2, 3].map((k) => <PanelSkeleton key={k} rows={2} height={100} />)}
          </div>
        ) : overview.error ? (
          <PanelError message={`Overview: ${overview.error}`} onRetry={overview.refresh} />
        ) : (
          <KpiSection data={kpis} />
        )}
        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          <CtaLink href="/opportunities?pageSize=10">View opportunities</CtaLink>
          <CtaLink href="/contracts?pageSize=10">View contracts</CtaLink>
          {kpis.expiringThisMonth > 0 && (
            <CtaLink href="/contracts?pageSize=10" warning>
              {kpis.expiringThisMonth} expiring this month
            </CtaLink>
          )}
        </div>
      </div>

      {/* ── Pipeline metrics ── */}
      <div style={{ padding: "0 10px" }}>
        {pipeline.loading ? (
          <PanelSkeleton height={220} />
        ) : pipeline.error ? (
          <PanelError message={`Pipeline: ${pipeline.error}`} onRetry={pipeline.refresh} />
        ) : (
          <>
            <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
              <Badge
                count={`Weighted: ${fmt(pipeline.data!.weightedPipelineValue)}`}
                style={{ backgroundColor: "#26a69a", fontSize: 12, fontWeight: 600 }}
                overflowCount={Number.MAX_SAFE_INTEGER}
              />
              <Badge
                count={`${pipeline.data!.conversionRate.toFixed(1)}% conversion`}
                style={{ backgroundColor: "#5c6bc0", fontSize: 12, fontWeight: 600 }}
                overflowCount={Number.MAX_SAFE_INTEGER}
              />
            </div>
            <PipelineSection data={funnel} />
          </>
        )}
        <div style={{ marginTop: 10 }}>
          <CtaLink href="/opportunities?pageSize=10">Full pipeline view</CtaLink>
        </div>
      </div>

      {/* ── Sales & Activities ── */}
      <div style={{ padding: "0 10px" }}>
        {actSum.loading ? (
          <PanelSkeleton height={240} />
        ) : actSum.error ? (
          <PanelError message={`Activities: ${actSum.error}`} onRetry={actSum.refresh} />
        ) : (
          <SalesActivitiesSection sales={FALLBACK_SALES} activities={activities} />
        )}
        <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
          <CtaLink href="/activities?pageSize=10">View all activities</CtaLink>
          {activities.overdue > 0 && (
            <CtaLink href="/activities?pageSize=10" warning>
              {activities.overdue} overdue
            </CtaLink>
          )}
        </div>
      </div>

      {/* ── Contracts Expiring (next 30 days) ── */}
      <div style={{ padding: "0 10px" }}>
        <div style={{ background: "#242424", borderRadius: 14, padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <span style={{ color: "#f0f0f0", fontWeight: 600, fontSize: 15 }}>
              Contracts Expiring{" "}
              <span style={{ color: "#a0a0a0", fontWeight: 400, fontSize: 13 }}>(next 30 days)</span>
            </span>
            <CtaLink href="/contracts?pageSize=10">View all contracts</CtaLink>
          </div>
          {expiring.loading ? (
            <PanelSkeleton rows={3} height={120} />
          ) : expiring.error ? (
            <PanelError message={`Expiring contracts: ${expiring.error}`} onRetry={expiring.refresh} />
          ) : !expiring.data?.length ? (
            <Text style={{ color: "#6a6a6a", fontSize: 13 }}>
              No contracts expiring in the next 30 days.
            </Text>
          ) : (
            <Table<ContractExpiring>
              dataSource={expiring.data}
              columns={expiringColumns}
              rowKey={(r, i) => r.id ?? String(i ?? 0)}
              size="small"
              pagination={false}
              style={{ background: "transparent" }}
            />
          )}
        </div>
      </div>

    </div>
  );
}
