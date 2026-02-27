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
import { useClientsStyles } from "./clients.module";
import { useClientAction, useClientState } from "../../../lib/providers/provider";

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

const PAGE_SIZE = 10;
const AVATAR_COLORS = ["#5c6bc0", "#26a69a", "#ef5350", "#f5a623", "#78909c", "#ab47bc", "#29b6f6", "#66bb6a", "#ff7043", "#8d6e63"];

const getAvatarInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "--";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
};

const getJoinedDate = (createdAt?: string) => {
  if (!createdAt) return "-";
  const parsed = new Date(createdAt);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString();
};

const STATUS_BADGE: Record<Client["status"], string> = {
  "In Progress": "badgeInProgress",
  "Pending":     "badgePending",
  "Approved":    "badgeApproved",
  "Complete":    "badgeComplete",
  "Rejected":    "badgeRejected",
};

export default function ClientList() {
  const { styles, cx } = useClientsStyles();
  const { clients, isPending, isError, clientsTotalPages } = useClientState();
  const { getClients } = useClientAction();
  const [search, setSearch]   = useState("");
  const [page, setPage]       = useState(1);

  useEffect(() => {
    getClients({ pageNumber: page, pageSize: PAGE_SIZE });
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const mappedClients: Client[] = (clients ?? []).map((client, index) => ({
    id: client.id ?? `client-${index + 1}`,
    clientId: `#CM${String(((page - 1) * PAGE_SIZE) + index + 1).padStart(4, "0")}`,
    name: client.name,
    industry: client.industry,
    joinedDate: getJoinedDate(client.createdAt),
    status: client.isActive === false ? "Rejected" : "Approved",
    avatarInitials: getAvatarInitials(client.name),
    avatarColor: AVATAR_COLORS[index % AVATAR_COLORS.length],
  }));

  const filtered = mappedClients.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.clientId.toLowerCase().includes(search.toLowerCase()) ||
      c.industry.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = clientsTotalPages ?? Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const rows = search ? filtered : mappedClients;

  if (isPending) {
    return <p>Loading clients...</p>;
  }

  if (isError) {
    return <p>Failed to load clients.</p>;
  }

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
        <Link href="/Client/createClient">
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

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
          <button
            key={pageNumber}
            className={cx(styles.pageBtn, page === pageNumber && styles.pageBtnActive)}
            onClick={() => setPage(pageNumber)}
          >
            {pageNumber}
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