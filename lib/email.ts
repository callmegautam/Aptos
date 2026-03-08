import nodemailer from 'nodemailer';

const getBaseUrl = () =>
  process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

function getTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: port ? Number(port) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user, pass }
  });
}

export async function sendVerificationEmail(to: string, token: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/api/auth/verify-email?token=${encodeURIComponent(token)}`;
  const transporter = getTransporter();

  const html = `
    <p>Please verify your email by clicking the link below:</p>
    <p><a href="${url}">${url}</a></p>
    <p>This link expires in 24 hours.</p>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject: 'Verify your email',
      html
    });
  }
  return { url };
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const baseUrl = getBaseUrl();
  const url = `${baseUrl}/reset-password?token=${encodeURIComponent(token)}`;
  const transporter = getTransporter();

  const html = `
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${url}">${url}</a></p>
    <p>This link expires in 1 hour.</p>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? process.env.SMTP_USER,
      to,
      subject: 'Reset your password',
      html
    });
  }
  return { url };
}
