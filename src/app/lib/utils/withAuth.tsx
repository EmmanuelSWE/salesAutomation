"use client";

import { useContext, useEffect, ComponentType, JSX } from "react";
import { useRouter } from "next/navigation";
import { UserStateContext } from "../providers/context";
import type { IUser } from "../providers/context";

/* ══════════════════════════════════════════════════════
   INJECTED PROPS
   Every wrapped component receives these automatically.
══════════════════════════════════════════════════════ */
export interface WithAuthProps {
  user:  IUser;
  token: string;
}

/* ══════════════════════════════════════════════════════
   OPTIONS
══════════════════════════════════════════════════════ */
export interface WithAuthOptions {
  /**
   * One or more roles allowed to view this component.
   * Leave undefined to allow any authenticated user.
   * Roles are compared case-insensitively.
   * Examples: "Admin", ["Admin", "Manager"]
   */
  roles?: string | string[];

  /** Path to redirect to when the user is not authenticated (default: "/login") */
  redirectTo?: string;

  /** Path to redirect to when the user lacks the required role (default: "/") */
  unauthorizedRedirect?: string;
}

/* ══════════════════════════════════════════════════════
   withAuth HOC
══════════════════════════════════════════════════════ */
export function withAuth<P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>,
  options: WithAuthOptions = {}
) {
  const {
    roles,
    redirectTo          = "/login",
    unauthorizedRedirect = "/",
  } = options;

  let rolesArray: string[];
  if (!roles) {
    rolesArray = [];
  } else if (Array.isArray(roles)) {
    rolesArray = roles;
  } else {
    rolesArray = [roles];
  }
  const allowedRoles = rolesArray.length ? rolesArray.map((r) => r.toLowerCase()) : null;

  function AuthGuard(props: Omit<P, keyof WithAuthProps>): JSX.Element | null {
    const router          = useRouter();
    const { isPending, isSuccess, isError, user, token } = useContext(UserStateContext);

    const isAuthenticated = isSuccess && !!token && !!user;

    /* ── Role check ── */
    const userRole = (user?.role ?? "").toLowerCase();
    const hasRole   = !allowedRoles || (isAuthenticated && allowedRoles.includes(userRole));

    useEffect(() => {
      if (isPending) return; // still rehydrating

      if (!isAuthenticated || isError) {
        router.replace(redirectTo);
        return;
      }

      if (!hasRole) {
        router.replace(unauthorizedRedirect);
      }
    }, [isPending, isAuthenticated, isError, hasRole, router]);

    if (isPending) {
      return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: "#1e1e1e" }}>
          <span style={{ color: "#fff", fontSize: 14 }}>Loading…</span>
        </div>
      );
    }

    if (!isAuthenticated || !hasRole) return null;

    // Narrow optional fields to required — safe because isAuthenticated guarantees both
    const safeUser:  IUser  = user  ?? ({} as IUser);
    const safeToken: string = token ?? "";
    return <WrappedComponent {...(props as P)} user={safeUser} token={safeToken} />;
  }

  AuthGuard.displayName = `withAuth(${WrappedComponent.displayName ?? WrappedComponent.name})`;
  return AuthGuard;
}
