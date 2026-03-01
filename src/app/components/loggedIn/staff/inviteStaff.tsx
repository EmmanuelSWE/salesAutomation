"use client";

import { useEffect, useState } from "react";
import emailjs from "@emailjs/browser";
import { useUserState } from "../../../lib/providers/provider";
import Link from "next/link";
import { ArrowLeftOutlined, CopyOutlined, CheckOutlined, LinkOutlined, MailOutlined, SendOutlined } from "@ant-design/icons";

// ── EmailJS config ─────────────────────────────────────────────────────────
// Set these in .env.local:
//   NEXT_PUBLIC_EMAILJS_SERVICE_ID   = service_xxxxxxx
//   NEXT_PUBLIC_EMAILJS_TEMPLATE_ID  = template_xxxxxxx
//   NEXT_PUBLIC_EMAILJS_PUBLIC_KEY   = your_public_key
//
// In your EmailJS template use these variables:
//   {{to_email}}  {{role}}  {{invite_link}}  {{inviter_name}}
// ---------------------------------------------------------------------------
const EJS_SERVICE  = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID  ?? "";
const EJS_TEMPLATE = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "";
const EJS_KEY      = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY  ?? "";

const ROLE_OPTIONS = ["SalesRep", "SalesManager", "Admin"];

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL ??
  (globalThis.window ? globalThis.window.location.origin : "http://localhost:3000");

/** Decode a JWT and return its payload claims (no verification). */
function decodeJwt(token: string): Record<string, unknown> {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replaceAll("-", "+").replaceAll("_", "/"));
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return {};
  }
}

type SendStatus = "idle" | "sending" | "sent" | "error";

function getSendBtnBg(s: SendStatus): string {
  if (s === "sent")    return "#1a3a1a";
  if (s === "sending") return "#444";
  return "#2a4a7a";
}
function getSendBtnColor(s: SendStatus): string {
  if (s === "sent")    return "#4caf50";
  if (s === "sending") return "#888";
  return "#90caf9";
}
function getSendBtnLabel(s: SendStatus): string {
  if (s === "sending") return "Sending\u2026";
  if (s === "sent")    return "Sent";
  return "Send via Email";
}

interface EmailSendPanelProps {
  email: string;
  sendStatus: SendStatus;
  ejsConfigured: boolean;
  onSend: () => void;
}
function EmailSendPanel({ email, sendStatus, ejsConfigured, onSend }: Readonly<EmailSendPanelProps>) {
  return (
    <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #333" }}>
      <div style={{ fontSize: 11, color: "#666", marginBottom: 10 }}>
        <MailOutlined style={{ marginRight: 6 }} />
        Send invite link directly to <span style={{ color: "#ccc" }}>{email}</span>
      </div>
      {sendStatus === "sent" && (
        <div style={{ color: "#4caf50", fontSize: 12, marginBottom: 8 }}>✓ Email sent successfully!</div>
      )}
      {sendStatus === "error" && (
        <div style={{ color: "#ef5350", fontSize: 12, marginBottom: 8 }}>✗ Failed to send. Check your EmailJS config in .env.local.</div>
      )}
      <button
        onClick={onSend}
        disabled={sendStatus === "sending" || sendStatus === "sent"}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          background: getSendBtnBg(sendStatus),
          border: `1px solid ${sendStatus === "sent" ? "#4caf50" : "#3a5a9a"}`,
          borderRadius: 8,
          padding: "9px 16px",
          fontSize: 13,
          fontWeight: 600,
          color: getSendBtnColor(sendStatus),
          cursor: (sendStatus === "sending" || sendStatus === "sent") ? "not-allowed" : "pointer",
          transition: "all 0.15s",
        }}
      >
        <SendOutlined />
        {getSendBtnLabel(sendStatus)}
      </button>
      {!ejsConfigured && (
        <div style={{ fontSize: 10, color: "#555", marginTop: 8 }}>
          EmailJS not configured — add NEXT_PUBLIC_EMAILJS_SERVICE_ID, NEXT_PUBLIC_EMAILJS_TEMPLATE_ID, NEXT_PUBLIC_EMAILJS_PUBLIC_KEY to .env.local
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#333",
  border: "1px solid #3a3a3a",
  borderRadius: 8,
  padding: "9px 12px",
  fontSize: 13,
  color: "#fff",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#888",
  marginBottom: 4,
  display: "block",
};

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 4,
  marginBottom: 20,
};

export default function InviteStaff() {
  const { user, token } = useUserState();
  const [role, setRole]             = useState("");
  const [email, setEmail]           = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [copied, setCopied]         = useState(false);
  const [error, setError]           = useState("");
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle");
  const inviterName = user ? `${user.firstName} ${user.lastName}`.trim() : "Admin";
  const ejsConfigured = Boolean(EJS_SERVICE && EJS_TEMPLATE && EJS_KEY);

  const jwtClaims = token ? decodeJwt(token) : {};
  const tenantId =
    (jwtClaims.tenantId  as string) ??
    (jwtClaims.tenant_id as string) ??
    (jwtClaims.TenantId  as string) ??
    user?.tenantId ??
    user?.tenant?.id ??
    "";

  useEffect(() => {
    console.log("[InviteStaff] JWT claims:", jwtClaims);
    console.log("[InviteStaff] resolved tenantId:", tenantId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, tenantId]);

  useEffect(() => {
    if (role && tenantId) {
      setInviteLink(
        `${APP_URL}/signup?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}`
      );
    } else {
      setInviteLink("");
    }
  }, [role, tenantId]);

  function handleGenerate() {
    setError("");
    if (!tenantId) { setError("Organisation ID could not be resolved. Please re-login."); return; }
    if (!role)     { setError("Please select a role first."); return; }
    setCopied(false);
    setSendStatus("idle");
  }

  async function handleCopy() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  }

  async function handleSendEmail() {
    if (!inviteLink || !email) return;
    if (!ejsConfigured) {
      setError("EmailJS is not configured. Add NEXT_PUBLIC_EMAILJS_* vars to .env.local.");
      return;
    }
    setSendStatus("sending");
    try {
      await emailjs.send(
        EJS_SERVICE,
        EJS_TEMPLATE,
        { to_email: email, role, invite_link: inviteLink, inviter_name: inviterName },
        { publicKey: EJS_KEY },
      );
      setSendStatus("sent");
    } catch (err) {
      console.error("[EmailJS] send error:", err);
      setSendStatus("error");
    }
  }

  return (
    <div style={{
      width: "100%",
      minHeight: "100vh",
      background: "#1e1e1e",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "40px 20px",
      boxSizing: "border-box",
    }}>
      <div style={{
        width: "100%",
        maxWidth: 480,
        background: "#2a2a2a",
        borderRadius: 16,
        padding: "32px 28px",
        color: "#fff",
        fontFamily: "'Inter', sans-serif",
        fontSize: 14,
      }}>
        <Link href="/staff" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#888", fontSize: 13, textDecoration: "none", marginBottom: 24 }}>
          <ArrowLeftOutlined /> Back to Staff
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <LinkOutlined style={{ color: "#f5a623", fontSize: 22 }} />
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Invite Staff Member</h1>
        </div>
        <p style={{ margin: "0 0 28px", color: "#666", fontSize: 13, lineHeight: 1.6 }}>
          Select a role to generate a pre-filled sign-up link. Copy it manually or send it via email using EmailJS.
        </p>

        {tenantId ? (
          <div style={{ background: "#1e1e1e", borderRadius: 8, padding: "10px 14px", marginBottom: 24, fontSize: 12, color: "#666", display: "flex", gap: 8 }}>
            <span style={{ color: "#555" }}>Organisation ID:</span>
            <span style={{ color: "#f5a623", fontFamily: "monospace" }}>{tenantId}</span>
          </div>
        ) : (
          <div style={{ background: "#3a1f1f", borderRadius: 8, padding: "10px 14px", marginBottom: 24, fontSize: 12, color: "#ef5350" }}>
             Organisation ID not found. Please re-login.
          </div>
        )}

        {/* Email input */}
        <div style={fieldStyle}>
          <label htmlFor="invite-email" style={labelStyle}>Recipient Email (optional)</label>
          <input
            id="invite-email"
            type="email"
            placeholder="colleague@company.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setSendStatus("idle"); }}
            style={inputStyle}
          />
        </div>

        {/* Role selector */}
        <div style={fieldStyle}>
          <label htmlFor="invite-role" style={labelStyle}>Role *</label>
          <select
            id="invite-role"
            value={role}
            onChange={(e) => { setRole(e.target.value); setError(""); setCopied(false); setSendStatus("idle"); }}
            style={inputStyle}
          >
            <option value="" disabled>Select a role…</option>
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {error && (
          <div style={{ background: "#3a1f1f", border: "1px solid #ef5350", borderRadius: 8, padding: "10px 14px", marginBottom: 16, color: "#ef5350", fontSize: 12 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: inviteLink ? 24 : 0 }}>
          <button
            onClick={handleGenerate}
            disabled={!role || !tenantId}
            style={{
              background: (!role || !tenantId) ? "#444" : "#f5a623",
              border: "none",
              borderRadius: 10,
              padding: "11px 28px",
              fontSize: 14,
              fontWeight: 700,
              color: (!role || !tenantId) ? "#888" : "#1a1000",
              cursor: (!role || !tenantId) ? "not-allowed" : "pointer",
              transition: "background 0.15s",
            }}
          >
            Generate Link
          </button>
        </div>

        {inviteLink && (
          <div style={{ background: "#1e1e1e", borderRadius: 10, padding: "16px", marginTop: 8 }}>
            <div style={{ fontSize: 11, color: "#666", marginBottom: 8 }}>Share this link with the new team member:</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                readOnly
                value={inviteLink}
                style={{
                  ...inputStyle,
                  flex: 1,
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: "#f5a623",
                  background: "#2a2a2a",
                  cursor: "text",
                }}
                onFocus={(e) => e.target.select()}
              />
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                style={{
                  flexShrink: 0,
                  background: copied ? "#1a3a1a" : "#3a3a3a",
                  border: `1px solid ${copied ? "#4caf50" : "#555"}`,
                  borderRadius: 8,
                  padding: "9px 12px",
                  color: copied ? "#4caf50" : "#fff",
                  cursor: "pointer",
                  fontSize: 16,
                  display: "flex",
                  alignItems: "center",
                  transition: "all 0.15s",
                }}
              >
                {copied ? <CheckOutlined /> : <CopyOutlined />}
              </button>
            </div>
            {copied && (
              <div style={{ fontSize: 11, color: "#4caf50", marginTop: 8 }}>✓ Copied to clipboard</div>
            )}

            {/* Send via EmailJS */}
            {email && (
              <EmailSendPanel
                email={email}
                sendStatus={sendStatus}
                ejsConfigured={ejsConfigured}
                onSend={handleSendEmail}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
