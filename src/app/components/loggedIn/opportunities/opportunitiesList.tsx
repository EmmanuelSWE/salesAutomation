"use client";

import { useEffect, useState } from "react";
import {
  SearchOutlined,
  SwapOutlined,
  FilterOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useOpportunitiesStyles } from "./opportunities.module";
import { useOpportunityState, useOpportunityAction } from "../../../lib/providers/provider";

const PAGE_SIZE = 10;

const AVATAR_COLORS = ["#5c6bc0","#26a69a","#ef5350","#f5a623","#78909c","#ab47bc","#29b6f6","#66bb6a","#ff7043","#8d6e63"];

const STAGE_LABEL: Record<number, string> = {
  1: "Prospecting",
  2: "Qualification",
  3: "Proposal",
  4: "Negotiation",
  5: "Closed Won",
  6: "Closed Lost",
};

const STAGE_COLOR: Record<number, { bg: string; text: string }> = {
  1: { bg: "rgba(92,107,192,0.15)",  text: "#5c6bc0" },
  2: { bg: "rgba(245,166,35,0.15)",  text: "#f5a623" },
  3: { bg: "rgba(41,182,246,0.15)",  text: "#29b6f6" },
  4: { bg: "rgba(171,71,188,0.15)",  text: "#ab47bc" },
  5: { bg: "rgba(38,166,154,0.15)",  text: "#26a69a" },
  6: { bg: "rgba(239,83,80,0.12)",   text: "#ef5350" },
};

const getInitials = (title: string) => {
  const words = title.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const formatDate = (iso?: string) => {
  if (!iso) return "-";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleDateString();
};

export default function OpportunitiesList() {
  const { styles, cx } = useOpportunitiesStyles();
  const { opportunities, isPending, isError } = useOpportunityState();
  const { getOpportunities } = useOpportunityAction();
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  useEffect(() => {
    getOpportunities({ pageNumber: page, pageSize: PAGE_SIZE });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  /* â”€â”€ Skeleton â”€â”€ */
  if (isPending) return (
    <div className={styles.page}>
      <h1 className={styles.title}>Opportunities</h1>
      <div className={styles.listContainer}>
        <div className={styles.toolbar}>
          <div className={styles.skeletonSearch} />
          <div className={styles.skeletonBtn} />
          <div className={styles.skeletonBtn} />
          <div className={styles.skeletonBtn} />
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Close Date</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {["a","b","c","d","e","f","g"].map((k) => (
                <tr key={k}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div className={styles.skeletonAvatar} />
                      <div className={styles.skeletonBlock} style={{ width: 160 }} />
                    </div>
                  </td>
                  <td><div className={styles.skeletonBlock} style={{ width: 110 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 80, borderRadius: 20 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 70 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 90 }} /></td>
                  <td><div className={styles.skeletonBlock} style={{ width: 50 }} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  /* â”€â”€ Error â”€â”€ */
  if (isError) return (
    <div className={styles.page}>
      <h1 className={styles.title}>Opportunities</h1>
      <p style={{ color: "#ef5350", marginTop: 40, textAlign: "center" }}>Failed to load opportunities.</p>
    </div>
  );

  const all = opportunities ?? [];

  const filtered = all.filter(
    (o) =>
      o.title.toLowerCase().includes(search.toLowerCase()) ||
      (o.clientId ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (STAGE_LABEL[Number(o.stage)] ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const rows = search ? filtered : all;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Opportunities</h1>

      <div className={styles.listContainer}>
        {/* â”€â”€ Toolbar â”€â”€ */}
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <SearchOutlined className={styles.searchIcon} />
            <input
              className={styles.searchInput}
              placeholder="Search by title, client or stageâ€¦"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <button className={styles.iconBtn} type="button" title="Sort"><SwapOutlined rotate={90} /></button>
          <button className={styles.iconBtn} type="button" title="Filter"><FilterOutlined /></button>
        </div>

        {/* â”€â”€ Table â”€â”€ */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Stage</th>
                <th>Value</th>
                <th>Close Date</th>
                <th>Probability</th>
              </tr>
            </thead>
            <tbody className={styles.tbody}>
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyRow}>No opportunities found.</td>
                </tr>
              ) : (
                rows.map((opp, i) => {
                  const stage      = Number(opp.stage);
                  const stageStyle = STAGE_COLOR[stage] ?? { bg: "rgba(102,102,102,0.15)", text: "#666" };
                  const closeDate  = formatDate(opp.expectedCloseDate);
                  return (
                    <tr key={opp.id ?? i}>
                      <td>
                        <div className={styles.clientCell}>
                          <div
                            className={styles.avatar}
                            style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                          >
                            {getInitials(opp.title)}
                          </div>
                          <span className={styles.clientName}>{opp.title}</span>
                        </div>
                      </td>
                      <td className={styles.idCell}>{opp.clientId ?? "-"}</td>
                      <td>
                        <span
                          className={styles.badge}
                          style={{ background: stageStyle.bg, color: stageStyle.text }}
                        >
                          {STAGE_LABEL[stage] ?? `Stage ${stage}`}
                        </span>
                      </td>
                      <td>{opp.currency ?? ""} {(opp.estimatedValue ?? 0).toLocaleString()}</td>
                      <td>
                        <div className={styles.dateCell}>
                          <CalendarOutlined />
                          {closeDate}
                        </div>
                      </td>
                      <td>{opp.probability == null ? "-" : `${opp.probability}%`}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* â”€â”€ Pagination â”€â”€ */}
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <LeftOutlined />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              className={cx(styles.pageBtn, page === n && styles.pageBtnActive)}
              onClick={() => setPage(n)}
            >
              {n}
            </button>
          ))}
          <button
            className={styles.pageBtn}
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <RightOutlined />
          </button>
        </div>
      </div>
    </div>
  );
}
