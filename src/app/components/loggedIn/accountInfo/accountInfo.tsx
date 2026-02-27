"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccountInfoStyles } from "./accountInfo.module";
import { useUserState, useUserAction } from "../../../lib/providers/provider";

function initials(firstName?: string, lastName?: string): string {
  const f = (firstName?.[0] ?? "").toUpperCase();
  const l = (lastName?.[0] ?? "").toUpperCase();
  return f + l || "?";
}

function formatDate(iso?: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AccountInfo() {
  const { styles } = useAccountInfoStyles();
  const { user, isPending } = useUserState();
  const { logoutUser, getOneUser } = useUserAction();
  const router = useRouter();

  // Re-fetch the full profile whenever we have a user id
  useEffect(() => {
    if (user?.id) getOneUser(user.id);
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleLogout() {
    logoutUser();
    router.replace("/login");
  }

  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Unknown User";

  if (isPending) return (
    <div className={styles.page}>
      <h1 className={styles.title}>Account Info</h1>

      {/* profile card skeleton */}
      <div className={styles.profileCard}>
        <div className={styles.skeletonCircle} />
        <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1 }}>
          <div className={styles.skeletonBlock} style={{ height: 20, width: 180 }} />
          <div className={styles.skeletonBlock} style={{ height: 14, width: 220 }} />
          <div className={styles.skeletonBlock} style={{ height: 22, width: 80, borderRadius: 20 }} />
        </div>
      </div>

      {/* personal details skeleton */}
      <div className={styles.section}>
        <div className={styles.skeletonBlock} style={{ height: 13, width: 120, marginBottom: 16 }} />
        <div className={styles.detailsGrid}>
          {["a","b","c","d"].map((k) => (
            <div key={k} className={styles.fieldCard}>
              <div className={styles.skeletonBlock} style={{ height: 11, width: 70, marginBottom: 10 }} />
              <div className={styles.skeletonBlock} style={{ height: 15, width: "60%" }} />
            </div>
          ))}
        </div>
      </div>

      {/* organisation skeleton */}
      <div className={styles.section}>
        <div className={styles.skeletonBlock} style={{ height: 13, width: 100, marginBottom: 16 }} />
        <div className={styles.detailsGrid}>
          {["e","f","g","h"].map((k) => (
            <div key={k} className={styles.fieldCard}>
              <div className={styles.skeletonBlock} style={{ height: 11, width: 70, marginBottom: 10 }} />
              <div className={styles.skeletonBlock} style={{ height: 15, width: "55%" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Account Info</h1>

      {/* ── Profile card ── */}
      <div className={styles.profileCard}>
        <div className={styles.avatar}>
          {initials(user?.firstName, user?.lastName)}
        </div>
        <div className={styles.profileMeta}>
          <p className={styles.fullName}>{fullName}</p>
          <p className={styles.email}>{user?.email ?? "—"}</p>
          <span className={styles.roleBadge}>{user?.role ?? "SalesRep"}</span>
        </div>
      </div>

      {/* ── Personal details ── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Personal Details</p>
        <div className={styles.detailsGrid}>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>First Name</span>
            <span className={user?.firstName ? styles.fieldValue : styles.fieldValueEmpty}>
              {user?.firstName ?? "Not set"}
            </span>
          </div>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Last Name</span>
            <span className={user?.lastName ? styles.fieldValue : styles.fieldValueEmpty}>
              {user?.lastName ?? "Not set"}
            </span>
          </div>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Email</span>
            <span className={user?.email ? styles.fieldValue : styles.fieldValueEmpty}>
              {user?.email ?? "Not set"}
            </span>
          </div>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Phone Number</span>
            <span className={user?.phoneNumber ? styles.fieldValue : styles.fieldValueEmpty}>
              {user?.phoneNumber ?? "Not set"}
            </span>
          </div>

        </div>
      </div>

      {/* ── Organisation details ── */}
      <div className={styles.section}>
        <p className={styles.sectionTitle}>Organisation</p>
        <div className={styles.detailsGrid}>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Organisation</span>
            <span className={user?.tenantName ? styles.fieldValue : styles.fieldValueEmpty}>
              {user?.tenantName ?? "Not set"}
            </span>
          </div>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Role</span>
            <span className={styles.fieldValue}>{user?.role ?? "SalesRep"}</span>
          </div>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>Member Since</span>
            <span className={styles.fieldValue}>{formatDate(user?.createdAt)}</span>
          </div>

          <div className={styles.fieldCard}>
            <span className={styles.fieldLabel}>User ID</span>
            <span className={user?.id ? styles.fieldValue : styles.fieldValueEmpty}>
              {user?.id ?? "—"}
            </span>
          </div>

        </div>
      </div>

      {/* ── Logout ── */}
      <button className={styles.logoutBtn} onClick={handleLogout}>
        Sign Out
      </button>
    </div>
  );
}
