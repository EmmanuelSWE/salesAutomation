"use client";

import Link from "next/link";

const NAV_GROUPS = [
  {
    label: "Auth",
    links: [
      { href: "/login",  text: "Login" },
      { href: "/signup", text: "Sign Up" },
    ],
  },
  {
    label: "Create",
    links: [
      { href: "/pricingRequests/create",                      text: "Pricing Request" },
      { href: "/contracts/create",                            text: "Contract" },
      { href: "/contracts/EXAMPLE_CONTRACT_ID/createRenewal", text: "Renewal" },
      { href: "/activities/create",                           text: "Activity" },
      { href: "/notes/create",                                text: "Note" },
    ],
  },
  {
    label: "Lists",
    links: [
      { href: "/clients",    text: "Clients" },
      { href: "/staff",      text: "Staff" },
      { href: "/activities", text: "Activities" },
    ],
  },
];

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: "48px 24px",
        boxSizing: "border-box",
      }}
    >
      {/* ── Hero ── */}
      <div style={{ textAlign: "center", marginBottom: 56 }}>
        <div
          style={{
            display: "inline-block",
            background: "#f39c12",
            borderRadius: "50%",
            width: 64,
            height: 64,
            lineHeight: "64px",
            fontSize: 28,
            marginBottom: 20,
          }}
        >
          ⚡
        </div>
        <h1
          style={{
            color: "#fff",
            fontSize: 36,
            fontWeight: 800,
            margin: "0 0 12px",
            letterSpacing: "-0.5px",
          }}
        >
          Sales Automation
        </h1>
        <p style={{ color: "#666", fontSize: 15, margin: 0 }}>
          Dev launch pad — pick a page below
        </p>
      </div>

      {/* ── Nav groups ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          justifyContent: "center",
          width: "100%",
          maxWidth: 780,
        }}
      >
        {NAV_GROUPS.map((group) => (
          <div
            key={group.label}
            style={{
              background: "#1a1a1a",
              border: "1px solid #2a2a2a",
              borderRadius: 14,
              padding: "24px 28px",
              minWidth: 200,
              flex: "1 1 200px",
            }}
          >
            <p
              style={{
                color: "#f39c12",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                margin: "0 0 16px",
              }}
            >
              {group.label}
            </p>
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      color: "#ccc",
                      textDecoration: "none",
                      fontSize: 14,
                      fontWeight: 500,
                      padding: "7px 12px",
                      borderRadius: 8,
                      background: "#222",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#f39c12";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#000";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLAnchorElement).style.background = "#222";
                      (e.currentTarget as HTMLAnchorElement).style.color = "#ccc";
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#f39c12",
                        flexShrink: 0,
                      }}
                    />
                    {link.text}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p style={{ color: "#333", fontSize: 12, marginTop: 48 }}>
        Sales Automation &copy; {new Date().getFullYear()}
      </p>
    </main>
  );
}

