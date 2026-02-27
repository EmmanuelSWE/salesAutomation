'use client';

import {
  HomeOutlined,
  TeamOutlined,
  CalendarOutlined,
  FileTextOutlined,
  UserOutlined,
  FundOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import { useSidebarStyles } from "./sideBar.module";
import Link from "next/link";
import { useUserState } from "../../../lib/providers/provider";

const BASE_NAV = [
  { icon: <HomeOutlined />,     label: "Overview",         href: "/admin/dashboard" },
  { icon: <TeamOutlined />,     label: "Clients",          href: "/clients" },
  { icon: <CalendarOutlined />, label: "Activities",       href: "/activities" },
  { icon: <FileTextOutlined />, label: "Pricing Requests", href: "/pricingRequests/create" },
  { icon: <UserOutlined />,     label: "Account",          href: "/account" },
] as const;

const OPPORTUNITY_NAV = { icon: <FundOutlined />,         label: "Opportunities", href: "/opportunities" };
const USERS_NAV       = { icon: <UsergroupAddOutlined />, label: "Users",         href: "/staff" };

const ROLE_LABELS: Record<string, string> = {
  salesrep:                    "Sales Rep",
  businessdevelopmentmanager:  "BDM",
  salesmanager:                "Sales Manager",
  admin:                       "Admin",
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { styles, cx } = useSidebarStyles();
  const userState = useUserState();

  const firstName = userState?.user?.firstName || "User";
  const role = userState?.user?.role?.toLowerCase() ?? "";
  const roleLabel = ROLE_LABELS[role] ?? userState?.user?.role ?? "";

  const navItems = [
    ...BASE_NAV,
    ...(["businessdevelopmentmanager", "salesmanager", "admin"].includes(role) ? [OPPORTUNITY_NAV] : []),
    ...(role === "admin" ? [USERS_NAV] : []),
  ];

  return (
    <aside className={cx(styles.sidebar, collapsed && styles.sidebarCollapsed)}>
      {/* ── Toggle button ── */}
      <button
        type="button"
        className={styles.toggleBtn}
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          style={{
            transform: collapsed ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
            display: "block",
          }}
        >
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* ── Top: logo + nav ── */}
      <div className={styles.sidebarTop}>
        <Link href="/" className={cx(styles.logo, collapsed && styles.logoCollapsed)}>
          <div className={styles.logoIcon}>⚡</div>
          {!collapsed && <span>TransformSales</span>}
        </Link>

        {navItems.map(({ icon, label, href }) => (
          <Link
            key={label}
            href={href}
            className={cx(styles.navItem, collapsed && styles.navItemCollapsed)}
            title={collapsed ? label : undefined}
          >
            <span className={styles.navIcon}>{icon}</span>
            {!collapsed && label}
          </Link>
        ))}
      </div>

      {/* ── Bottom: user ── */}
      <div className={cx(styles.footer, collapsed && styles.footerCollapsed)}>
        <div className={styles.avatar}>👤</div>
        {!collapsed && (
          <span>{firstName}{roleLabel ? ` (${roleLabel})` : ""}</span>
        )}
      </div>
    </aside>
  );
}