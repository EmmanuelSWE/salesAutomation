"use client";

import { BellOutlined } from "@ant-design/icons";
import { useTopBarStyles } from "./topBar.module";
import NotificationBell from "../../NotificationBell";

interface TopBarProps {
  /** Breadcrumb trail, e.g. ["Dashboards", "Overview"] */
  crumbs?: string[];
}

export default function TopBar({ crumbs = ["Dashboards", "Overview"] }: Readonly<TopBarProps>) {
  const { styles } = useTopBarStyles();

  return (
    <header className={styles.topbar}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumb}>
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          return (
            <span key={crumb} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {i > 0 && <span className={styles.breadcrumbSep}>/</span>}
              <span className={isLast ? styles.breadcrumbActive : undefined}>
                {crumb}
              </span>
            </span>
          );
        })}
      </div>

      {/* Actions */}
      <div className={styles.right}>
        <div className={styles.iconBtn}> <BellOutlined /></div>
      </div>
    </header>
  );
}