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
  { icon: <FileTextOutlined />, label: "Pricing Requests", href: "/pricingRequests" },
  { icon: <UserOutlined />,     label: "Account",          href: "/account" },
] as const;

const OPPORTUNITY_NAV = { icon: <FundOutlined />,         label: "Opportunities", href: "/opportunities" };
const USERS_NAV       = { icon: <UsergroupAddOutlined />, label: "Users",         href: "/staff" };

const ROLE_LABELS: Record<string, string> = {
  SalesRep:                    "Sales Rep",
  BusinessDevelopmentManager:  "BDM",
  SalesManager:                "Sales Manager",
  Admin:                       "Admin",
};

/* roles that can see Opportunities */
const OPPORTUNITY_ROLES = new Set(["Admin", "SalesManager", "BusinessDevelopmentManager"]);
/* roles that can see Users/Staff */
const USERS_ROLES       = new Set(["Admin", "SalesManager"]);

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ collapsed, onToggle }: Readonly<SidebarProps>) {
  const { styles, cx } = useSidebarStyles();
  const userState = useUserState();

  const firstName = userState?.user?.firstName || "User";
  /* roles array from API, e.g. ["Admin"] or ["SalesRep"] */
  const roles     = userState?.user?.roles ?? (userState?.user?.role ? [userState.user.role] : []);

  /* Label shown in footer: join all role labels */
  const roleLabel = roles.map((r) => ROLE_LABELS[r] ?? r).join(", ");

  const navItems = [
    ...BASE_NAV,
    ...(roles.some((r) => OPPORTUNITY_ROLES.has(r)) ? [OPPORTUNITY_NAV] : []),
    ...(roles.some((r) => USERS_ROLES.has(r))       ? [USERS_NAV]       : []),
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