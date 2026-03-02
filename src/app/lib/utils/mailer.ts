import nodemailer from "nodemailer";

/**
 * Nodemailer transporter.
 * Configure via environment variables:
 *   SMTP_HOST   – e.g. smtp.gmail.com
 *   SMTP_PORT   – e.g. 587
 *   SMTP_USER   – sender email / username
 *   SMTP_PASS   – password or app-password
 *   SMTP_FROM   – "From" display name + address, e.g. "Sales App <no-reply@example.com>"
 *
 * For local dev without a real SMTP server, set SMTP_USE_ETHEREAL=true and the
 * transporter will use a free Ethereal.email catch-all account automatically.
 */

let _transporter: nodemailer.Transporter | null = null;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (_transporter) return _transporter;

  if (process.env.SMTP_USE_ETHEREAL === "true") {
    const testAccount = await nodemailer.createTestAccount();
    // Do NOT cache Ethereal transporter — always create fresh in dev
    // so config changes (e.g. tls options) take effect without a full restart
    const etherealTransport = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
      tls: { rejectUnauthorized: false },
    });
    console.log("[mailer] Using Ethereal test account:", testAccount.user);
    return etherealTransport;
  }

  _transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST ?? "smtp.gmail.com",
    port:   Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT ?? 587) === 465,
    auth: {
      user: process.env.SMTP_USER ?? "",
      pass: process.env.SMTP_PASS ?? "",
    },
  });

  return _transporter;
}

export interface InvitationEmailOptions {
  toEmail:     string;
  role:        string;
  tenantId:    string;
  inviterName: string;
  appUrl:      string; // e.g. http://localhost:3000
}

export async function sendInvitationEmail(opts: InvitationEmailOptions): Promise<{ previewUrl?: string }> {
  const { toEmail, role, tenantId, inviterName, appUrl } = opts;

  const signupUrl = `${appUrl}/signup?tenantId=${encodeURIComponent(tenantId)}&role=${encodeURIComponent(role)}`;

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>You're Invited</title>
</head>
<body style="margin:0;padding:0;background:#1a1a1a;font-family:'Inter',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1a1a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#2a2a2a;border-radius:16px;overflow:hidden;max-width:560px;width:100%;">

          <!-- Header -->
          <tr>
            <td style="background:#f5a623;padding:24px 32px;">
              <div style="font-size:28px;font-weight:800;color:#1a1000;letter-spacing:-0.5px;">⚡ Sales Platform</div>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 32px;">
              <h1 style="margin:0 0 12px;font-size:22px;font-weight:700;color:#fff;">You've been invited!</h1>
              <p style="margin:0 0 8px;font-size:14px;color:#aaa;line-height:1.6;">
                <strong style="color:#fff;">${inviterName}</strong> has invited you to join their organisation on <strong style="color:#fff;">Sales Platform</strong> as a <strong style="color:#f5a623;">${role}</strong>.
              </p>
              <p style="margin:0 0 32px;font-size:13px;color:#666;line-height:1.6;">
                Click the button below to create your account. Your organisation and role are pre-filled — just enter your personal details and a password.
              </p>

              <!-- CTA Button -->
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="border-radius:10px;background:#f5a623;">
                    <a href="${signupUrl}"
                       target="_blank"
                       style="display:inline-block;padding:14px 36px;font-size:15px;font-weight:700;color:#1a1000;text-decoration:none;border-radius:10px;">
                      Accept Invitation →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:12px;color:#555;line-height:1.6;">
                Or copy this link into your browser:<br/>
                <a href="${signupUrl}" style="color:#f5a623;word-break:break-all;">${signupUrl}</a>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;border-top:1px solid #333;">
              <p style="margin:0;font-size:11px;color:#444;">
                If you weren't expecting this invitation, you can safely ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

  const transporter = await getTransporter();
  const info = await transporter.sendMail({
    from:    process.env.SMTP_FROM ?? `"Sales Platform" <no-reply@salesplatform.com>`,
    to:      toEmail,
    subject: `${inviterName} invited you to join Sales Platform as ${role}`,
    html,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
  if (previewUrl) console.log("[mailer] Ethereal preview URL:", previewUrl);

  return { previewUrl: previewUrl ? String(previewUrl) : undefined };
}
