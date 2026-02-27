"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  SearchOutlined,
  SwapOutlined,
  FilterOutlined,
  PlusOutlined,
  CalendarOutlined,
  LeftOutlined,
  RightOutlined,
} from "@ant-design/icons";
import { useActivitiesStyles } from "./activities.module";
import { useActivityState, useActivityAction } from "../../../lib/providers/provider";

const PAGE_SIZE = 5;
const AVATAR_COLORS = ["#5c6bc0","#26a69a","#ef5350","#f5a623","#78909c","#ab47bc","#29b6f6","#66bb6a","#ff7043","#8d6e63"];

const PRIORITY_BADGE: Record<string, string> = {
  High:   "badgeRejected",
  Medium: "badgePending",
  Low:    "badgeApproved",
};

const getAvatarInitials = (subject: string) => {
  const words = subject.trim().split(/\s+/);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

export default function ActivitiesList() {
  const { styles, cx } = useActivitiesStyles();
  const { activities, isPending, isError } = useActivityState();
  const { getActivities } = useActivityAction();
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);

  useEffect(() => {
    getActivities();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (isPending) return <p>Loading activities...</p>;
  if (isError)   return <p>Failed to load activities.</p>;

  const list = (activities ?? []).map((a, index) => ({
    id:             a.id ?? `activity-${index}`,
    subject:        a.subject,
    type:           a.type,
    priority:       a.priority ?? "Medium",
    dueDate:        a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-",
    avatarInitials: getAvatarInitials(a.subject),
    avatarColor:    AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));

  const filtered = list.filter(
    (a) =>
      a.subject.toLowerCase().includes(search.toLowerCase()) ||
      a.type.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows       = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Activities List</h1>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <SearchOutlined className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
        </div>
        <button className={styles.iconBtn} title="Sort"><SwapOutlined rotate={90} /></button>
        <button className={styles.iconBtn} title="Filter"><FilterOutlined /></button>
        <Link href="/activities/create">
          <button className={styles.addBtn} title="Add activity"><PlusOutlined /></button>
        </Link>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Subject</th>
              <th>Type</th>
              <th>Due Date</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((activity) => (
              <tr key={activity.id}>
                <td>
                  <div className={styles.clientCell}>
                    <div className={styles.avatar} style={{ background: activity.avatarColor }}>
                      {activity.avatarInitials}
                    </div>
                    <span className={styles.clientName}>{activity.subject}</span>
                  </div>
                </td>
                <td>{activity.type}</td>
                <td>
                  <div className={styles.dateCell}>
                    <CalendarOutlined />
                    {activity.dueDate}
                  </div>
                </td>
                <td>
                  <span className={cx(styles.badge, styles[PRIORITY_BADGE[activity.priority] as keyof typeof styles])}>
                    {activity.priority}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <button className={styles.pageBtn} onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
          <LeftOutlined />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
          <button key={n} className={cx(styles.pageBtn, page === n && styles.pageBtnActive)} onClick={() => setPage(n)}>
            {n}
          </button>
        ))}
        <button className={styles.pageBtn} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
          <RightOutlined />
        </button>
      </div>
    </div>
  );
}
