"use client";

import { useEffect, useState } from "react";
import {
  SearchOutlined,
  LeftOutlined,
  RightOutlined,
  SwapOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import { createStyles } from "antd-style";
import { useOpportunityState, useOpportunityAction } from "../../../lib/providers/provider";

const PAGE_SIZE = 10;

const STAGE_LABELS: Record<number, string> = {
  1: "Prospecting",
  2: "Qualification",
  3: "Proposal",
  4: "Negotiation",
  5: "Closed Won",
  6: "Closed Lost",
};

const STAGE_COLOR: Record<number, string> = {
  1: "#5c6bc0",
  2: "#f5a623",
  3: "#29b6f6",
  4: "#ab47bc",
  5: "#26a69a",
  6: "#ef5350",
};

const AVATAR_COLORS = ["#5c6bc0", "#26a69a", "#ef5350", "#f5a623", "#78909c", "#ab47bc", "#29b6f6", "#66bb6a", "#ff7043", "#8d6e63"];

const useStyles = createStyles(({ css, token }) => ({
  page: css`
    padding: 28px 32px;
    min-height: 100%;
    background: ${token.colorBgBase};
    font-family: 'Inter', sans-serif;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 22px;
    flex-wrap: wrap;
    gap: 12px;
  `,
  title: css`
    color: #fff;
    font-size: 20px;
    font-weight: 700;
    margin: 0;
  `,
  controls: css`
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  `,
  searchBar: css`
    display: flex;
    align-items: center;
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 7px 12px;
    gap: 8px;
    color: #666;
    min-width: 220px;
    input {
      background: transparent;
      border: none;
      outline: none;
      color: #ccc;
      font-size: 13px;
      width: 100%;
      &::placeholder { color: #444; }
    }
  `,
  iconBtn: css`
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 8px 12px;
    color: #666;
    cursor: pointer;
    font-size: 14px;
    transition: border-color 0.15s, color 0.15s;
    &:hover { border-color: #f5a623; color: #f5a623; }
  `,
  table: css`
    width: 100%;
    border-collapse: collapse;
  `,
  th: css`
    text-align: left;
    color: #555;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    padding: 0 14px 12px;
    border-bottom: 1px solid #1e1e1e;
  `,
  row: css`
    border-bottom: 1px solid #181818;
    transition: background 0.12s;
    &:hover { background: #161616; }
  `,
  td: css`
    padding: 13px 14px;
    color: #ccc;
    font-size: 13px;
    vertical-align: middle;
  `,
  avatarCell: css`
    display: flex;
    align-items: center;
    gap: 10px;
  `,
  avatar: css`
    width: 34px;
    height: 34px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    flex-shrink: 0;
  `,
  badge: css`
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.02em;
  `,
  pagination: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 20px;
  `,
  pageBtn: css`
    background: #1a1a1a;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 6px 10px;
    color: #666;
    cursor: pointer;
    font-size: 13px;
    &:hover:not(:disabled) { border-color: #f5a623; color: #f5a623; }
    &:disabled { opacity: 0.35; cursor: not-allowed; }
  `,
  pageInfo: css`
    color: #555;
    font-size: 12px;
  `,
  skeletonBlock: css`
    background: linear-gradient(90deg, #1e1e1e 25%, #2a2a2a 50%, #1e1e1e 75%);
    background-size: 200% 100%;
    animation: skel 1.4s ease-in-out infinite;
    border-radius: 6px;
    @keyframes skel {
      0%   { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  `,
  errorBox: css`
    color: #ef5350;
    background: rgba(239,83,80,0.08);
    border-radius: 8px;
    padding: 16px 20px;
    font-size: 14px;
  `,
}));

export default function OpportunitiesList() {
  const { styles } = useStyles();
  const { opportunities, isPending, isError } = useOpportunityState();
  const { getOpportunities } = useOpportunityAction();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getOpportunities({ pageNumber: page, pageSize: PAGE_SIZE });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <div className={styles.skeletonBlock} style={{ width: 180, height: 26 }} />
          <div style={{ display: "flex", gap: 10 }}>
            <div className={styles.skeletonBlock} style={{ width: 220, height: 36 }} />
            <div className={styles.skeletonBlock} style={{ width: 40, height: 36 }} />
          </div>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              {["Title", "Client", "Stage", "Value", "Close Date", "Probability"].map((h) => (
                <th key={h} className={styles.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 7 }).map((_, i) => (
              <tr key={i} className={styles.row}>
                <td className={styles.td}><div className={styles.skeletonBlock} style={{ width: 160, height: 14 }} /></td>
                <td className={styles.td}><div className={styles.skeletonBlock} style={{ width: 110, height: 14 }} /></td>
                <td className={styles.td}><div className={styles.skeletonBlock} style={{ width: 80, height: 22, borderRadius: 20 }} /></td>
                <td className={styles.td}><div className={styles.skeletonBlock} style={{ width: 70, height: 14 }} /></td>
                <td className={styles.td}><div className={styles.skeletonBlock} style={{ width: 90, height: 14 }} /></td>
                <td className={styles.td}><div className={styles.skeletonBlock} style={{ width: 50, height: 14 }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.page}>
        <p className={styles.errorBox}>Failed to load opportunities. Please try again.</p>
      </div>
    );
  }

  const all = opportunities ?? [];
  const filtered = all.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      o.clientId.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Opportunities</h1>
        <div className={styles.controls}>
          <div className={styles.searchBar}>
            <SearchOutlined />
            <input
              placeholder="Search opportunities…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className={styles.iconBtn} type="button"><SwapOutlined /></button>
          <button className={styles.iconBtn} type="button"><FilterOutlined /></button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Title</th>
            <th className={styles.th}>Client</th>
            <th className={styles.th}>Stage</th>
            <th className={styles.th}>Value</th>
            <th className={styles.th}>Close Date</th>
            <th className={styles.th}>Probability</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr>
              <td colSpan={6} className={styles.td} style={{ textAlign: "center", color: "#444", padding: "32px 0" }}>
                No opportunities found.
              </td>
            </tr>
          ) : (
            filtered.map((opp, i) => {
              const stage   = Number(opp.stage);
              const color   = STAGE_COLOR[stage] ?? "#666";
              const initials = opp.title.slice(0, 2).toUpperCase();
              const closeDate = opp.expectedCloseDate
                ? new Date(opp.expectedCloseDate).toLocaleDateString()
                : "-";
              return (
                <tr key={opp.id ?? i} className={styles.row}>
                  <td className={styles.td}>
                    <div className={styles.avatarCell}>
                      <div
                        className={styles.avatar}
                        style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                      >
                        {initials}
                      </div>
                      <span style={{ color: "#e0e0e0", fontWeight: 500 }}>{opp.title}</span>
                    </div>
                  </td>
                  <td className={styles.td} style={{ color: "#888", fontSize: 12 }}>{opp.clientId}</td>
                  <td className={styles.td}>
                    <span
                      className={styles.badge}
                      style={{ background: `${color}22`, color }}
                    >
                      {STAGE_LABELS[stage] ?? `Stage ${stage}`}
                    </span>
                  </td>
                  <td className={styles.td}>
                    {opp.currency} {opp.estimatedValue.toLocaleString()}
                  </td>
                  <td className={styles.td}>{closeDate}</td>
                  <td className={styles.td}>
                    {opp.probability != null ? `${opp.probability}%` : "-"}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <span className={styles.pageInfo}>Page {page}</span>
        <button className={styles.pageBtn} type="button" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          <LeftOutlined />
        </button>
        <button className={styles.pageBtn} type="button" disabled={filtered.length < PAGE_SIZE} onClick={() => setPage((p) => p + 1)}>
          <RightOutlined />
        </button>
      </div>
    </div>
  );
}
