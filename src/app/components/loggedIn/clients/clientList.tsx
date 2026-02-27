"use client";

import { useState } from "react";
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
import { useClientsStyles } from "./clients.module";

interface Client {
  id: string;
  clientId: string;
  name: string;
  industry: string;
  joinedDate: string;
  status: "In Progress" | "Pending" | "Approved" | "Rejected" | "Complete";
  avatarInitials: string;
  avatarColor: string;
}

// Placeholder — replace with fetch to GET /api/clients
const DUMMY: Client[] = [
  { id: "abc123", clientId: "#CM9801", name: "Acme Corp",       industry: "Technology",    joinedDate: "Just now",       status: "In Progress", avatarInitials: "AC", avatarColor: "#5c6bc0" },
  { id: "def456", clientId: "#CM9802", name: "Beta LLC",        industry: "Finance",       joinedDate: "1 minute ago",   status: "Complete",    avatarInitials: "BL", avatarColor: "#26a69a" },
  { id: "ghi789", clientId: "#CM9803", name: "Gamma Inc",       industry: "Healthcare",    joinedDate: "1 hour ago",     status: "Pending",     avatarInitials: "GI", avatarColor: "#ef5350" },
  { id: "jkl012", clientId: "#CM9804", name: "Delta Corp",      industry: "Retail",        joinedDate: "Yesterday",      status: "Approved",    avatarInitials: "DC", avatarColor: "#f5a623" },
  { id: "mno345", clientId: "#CM9805", name: "Epsilon Ltd",     industry: "Manufacturing", joinedDate: "Feb 2, 2026",    status: "Rejected",    avatarInitials: "EL", avatarColor: "#78909c" },
  { id: "pqr678", clientId: "#CM9806", name: "Zeta Partners",   industry: "Education",     joinedDate: "Just now",       status: "In Progress", avatarInitials: "ZP", avatarColor: "#ab47bc" },
  { id: "stu901", clientId: "#CM9807", name: "Eta Solutions",   industry: "Legal",         joinedDate: "3 hours ago",    status: "Pending",     avatarInitials: "ES", avatarColor: "#29b6f6" },
  { id: "vwx234", clientId: "#CM9808", name: "Theta Group",     industry: "Technology",    joinedDate: "Feb 1, 2026",    status: "Complete",    avatarInitials: "TG", avatarColor: "#66bb6a" },
  { id: "yza567", clientId: "#CM9809", name: "Iota Ventures",   industry: "Finance",       joinedDate: "Jan 30, 2026",   status: "Approved",    avatarInitials: "IV", avatarColor: "#ff7043" },
  { id: "bcd890", clientId: "#CM9810", name: "Kappa Industries",industry: "Healthcare",    joinedDate: "Jan 28, 2026",   status: "Rejected",    avatarInitials: "KI", avatarColor: "#8d6e63" },
];

const PAGE_SIZE = 5;

const STATUS_BADGE: Record<Client["status"], string> = {
  "In Progress": "badgeInProgress",
  "Pending":     "badgePending",
  "Approved":    "badgeApproved",
  "Complete":    "badgeComplete",
  "Rejected":    "badgeRejected",
};

export default function ClientList() {
  const { styles, cx } = useClientsStyles();
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  const filtered = DUMMY.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.clientId.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const rows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Client List</h1>

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
        <Link href="/admin/clients/create">
          <button className={styles.addBtn} title="Add client"><PlusOutlined /></button>
        </Link>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Client ID</th>
              <th>Client</th>
              <th>Industry</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {rows.map((client) => (
              <tr key={client.id}>
                <td className={styles.idCell}>
                  <Link href={`/Client/${client.id}/clientOverView`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {client.clientId}
                  </Link>
                </td>
                <td>
                  <Link href={`/Client/${client.id}/clientOverView`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.clientCell}>
                      <div
                        className={styles.avatar}
                        style={{ background: client.avatarColor }}
                      >
                        {client.avatarInitials}
                      </div>
                      <span className={styles.clientName}>{client.name}</span>
                    </div>
                  </Link>
                </td>
                <td>
                  <Link href={`/Client/${client.id}/clientOverView`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {client.industry}
                  </Link>
                </td>
                <td>
                  <Link href={`/Client/${client.id}/clientOverView`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div className={styles.dateCell}>
                      <CalendarOutlined />
                      {client.joinedDate}
                    </div>
                  </Link>
                </td>
                <td>
                  <Link href={`/Client/${client.id}/clientOverView`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <span className={cx(styles.badge, styles[STATUS_BADGE[client.status] as keyof typeof styles])}>
                      {client.status}
                    </span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      <div className={styles.pagination}>
        <button
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          <LeftOutlined />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={cx(styles.pageBtn, page === i + 1 && styles.pageBtnActive)}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}

        <button
          className={styles.pageBtn}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
        >
          <RightOutlined />
        </button>
      </div>
    </div>
  );
}