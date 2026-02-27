"use client";

import Link from "next/link";

export default function LandingPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: [
          "radial-gradient(ellipse 55% 60% at 95% 50%, rgba(243,156,18,0.45) 0%, transparent 70%)",
          "radial-gradient(ellipse 55% 60% at 5%  50%, rgba(236,64,122,0.35) 0%, transparent 70%)",
          "radial-gradient(ellipse 40% 40% at 50% 100%, rgba(243,100,10,0.18) 0%, transparent 65%)",
          "#050505",
        ].join(","),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Inter', sans-serif",
        padding: "48px 24px",
        boxSizing: "border-box" as const,
      }}
    >
      {/* ── logo badge ── */}
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          background: "linear-gradient(135deg, #f39c12 0%, #e67e22 100%)",
          boxShadow: "0 4px 28px rgba(243,156,18,0.55)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 30,
          marginBottom: 28,
        }}
      >
        ⚡
      </div>

      {/* ── headline ── */}
      <h1
        style={{
          color: "#fff",
          fontSize: 42,
          fontWeight: 800,
          margin: "0 0 14px",
          letterSpacing: "-1px",
          textAlign: "center",
        }}
      >
        TransformSales
      </h1>
      <p
        style={{
          color: "rgba(255,255,255,0.45)",
          fontSize: 16,
          margin: "0 0 52px",
          textAlign: "center",
          maxWidth: 380,
          lineHeight: 1.6,
        }}
      >
        Close more deals, faster. Your pipeline — organised and automated.
      </p>

      {/* ── CTA buttons ── */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          href="/login"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 44px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #f5c518 0%, #f39c12 100%)",
            color: "#1a0e00",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(245,197,24,0.35)",
            letterSpacing: "0.02em",
          }}
        >
          Log In
        </Link>
        <Link
          href="/signup"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "14px 44px",
            borderRadius: 12,
            background: "linear-gradient(135deg, #f9e84a 0%, #f5c518 100%)",
            color: "#1a0e00",
            fontWeight: 700,
            fontSize: 15,
            textDecoration: "none",
            boxShadow: "0 4px 20px rgba(249,232,74,0.30)",
            letterSpacing: "0.02em",
          }}
        >
          Sign Up
        </Link>
      </div>

      <p style={{ color: "#2a2a2a", fontSize: 12, marginTop: 64 }}>
        &copy; {new Date().getFullYear()} TransformSales
      </p>
    </main>
  );
}

