import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : undefined;
  const secure =
    typeof process.env.SMTP_SECURE === "string"
      ? process.env.SMTP_SECURE.toLowerCase() === "true"
      : undefined;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !port || typeof secure !== "boolean" || !user || !pass) return null;
  return { host, port, secure, auth: { user, pass } };
}

export async function POST(req) {
  try {
    const smtp = getSmtpConfig();
    if (!smtp) {
      return NextResponse.json(
        {
          error:
            "SMTP is not configured. Set SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { toEmail, clientName, businessName, content } = body || {};

    if (!toEmail || !content || !businessName) {
      return NextResponse.json(
        { error: "Missing required fields: toEmail, businessName, content." },
        { status: 400 }
      );
    }

    const fromName = process.env.SMTP_FROM_NAME || "Social Media Agent";
    const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;

    const transporter = nodemailer.createTransport(smtp);

    const safeClientName = clientName ? String(clientName) : "there";
    const subject = `Your 30-Day Content Plan for ${businessName}`;
    const text = `Hi ${safeClientName},

Your personalised 30-day social media content calendar for ${businessName} is ready.

---
${content}
---

If you'd like next month's content or want revisions, reply to this email.

Best,
${fromName}`;

    await transporter.sendMail({
      from: `${fromName} <${fromEmail}>`,
      to: toEmail,
      subject,
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error delivering email:", error);
    return NextResponse.json(
      { error: "Failed to send email", details: error.message },
      { status: 500 }
    );
  }
}

