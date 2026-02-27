'use client';

import {
  HomeOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useSidebarStyles } from "./sideBar.module";
import Link from "next/link";
import { useUserState } from "../../../lib/providers/provider";

const NAV_ITEMS = [
  { icon: <HomeOutlined />,     label: "Overview",         href: "/admin/dashboard" },
  { icon: <TeamOutlined />,     label: "Clients",          href: "/clients" },
  { icon: <CalendarOutlined />, label: "Activities",       href: "/activities" },
  { icon: <FileTextOutlined />, label: "Pricing Requests", href: "/pricingRequests/create" },
  { icon: <UserOutlined />,     label: "Account",          href: "/account" },
] as const;

const ROLE_LABELS: Record<string, string> = {
  salesrep:                    "SalesRep",
  businessdevelopmentmanager:  "BusinessDevelopmentManager",
  salesmanager:                "SalesManager",
  admin:                       "Admin",
};

export default function Sidebar() {
  const { styles } = useSidebarStyles();
  const userState = useUserState();

  const firstName = userState?.user?.firstName || "User";
  const roleLabel = userState?.user?.role
    ? (ROLE_LABELS[userState.user.role.toLowerCase()] ?? userState.user.role)
    : "";

  return (
    <aside className={styles.sidebar}>
      {/* ── Top: logo + nav ── */}
      <div className={styles.sidebarTop}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoIcon}>⚡</div>
          <span> TransformSales</span>
        </Link>

        {NAV_ITEMS.map(({ icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className={styles.navItem}
          >
            <span className={styles.navIcon}>{icon}</span>
            {label}
          </Link>
        ))}
      </div>

      {/* ── Bottom: user ── */}
      <div className={styles.footer}>
        <div className={styles.avatar}>👤</div>
        <span>
          {firstName}{roleLabel ? ` (${roleLabel})` : ""}
        </span>
      </div>
    </aside>
  );
}