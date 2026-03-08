// import nodemailer from 'nodemailer';

// const BASE_URL = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

// const SMTP_HOST = process.env.SMTP_HOST;
// const SMTP_PORT = Number(process.env.SMTP_PORT ?? 587);
// const SMTP_USER = process.env.SMTP_USER;
// const SMTP_PASS = process.env.SMTP_PASS;
// const SMTP_SECURE = process.env.SMTP_SECURE === 'true';

// let transporter: nodemailer.Transporter | null = null;

// function getTransporter() {
//   if (transporter) return transporter;

//   if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
//     console.warn('SMTP not configured — emails will not be sent');
//     return null;
//   }

//   transporter = nodemailer.createTransport({
//     host: SMTP_HOST,
//     port: SMTP_PORT,
//     secure: SMTP_SECURE,
//     auth: {
//       user: SMTP_USER,
//       pass: SMTP_PASS
//     }
//   });

//   return transporter;
// }

// async function sendEmail(to: string, subject: string, html: string) {
//   const transporter = getTransporter();

//   if (!transporter) {
//     console.log('Transporter not available');
//     return;
//   }

//   const info = await transporter.sendMail({
//     from: process.env.SMTP_FROM ?? SMTP_USER,
//     to,
//     subject,
//     html
//   });

//   console.log('EMAIL SENT:', info);
// }
// export async function sendVerificationEmail(to: string, token: string) {
//   const url = `${BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

//   console.log('Verification email URL:', url);

//   const html = `
//     <p>Please verify your email by clicking the link below:</p>
//     <p><a href="${url}">${url}</a></p>
//     <p>This link expires in 24 hours.</p>
//   `;

//   await sendEmail(to, 'Verify your email', html);
//   console.log('Verification email sent to:', to);

//   return { url };
// }

// export async function sendPasswordResetEmail(to: string, token: string) {
//   const url = `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

//   const html = `
//     <p>You requested a password reset.</p>
//     <p><a href="${url}">${url}</a></p>
//     <p>This link expires in 1 hour.</p>
//   `;

//   await sendEmail(to, 'Reset your password', html);

//   return { url };
// }

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const BASE_URL = process.env.NEXTAUTH_URL ?? process.env.APP_URL ?? 'http://localhost:3000';

async function sendEmail(to: string, subject: string, html: string) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('Resend not configured — emails will not be sent');
    return;
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'onboarding@resend.dev',
      to,
      subject,
      html
    });

    if (error) {
      console.error('EMAIL FAILED:', error);
      return;
    }

    console.log('EMAIL SENT:', data?.id);
  } catch (err) {
    console.error('EMAIL ERROR:', err);
  }
}

export async function sendVerificationEmail(to: string, token: string) {
  const url = `${BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  console.log('Verification email URL:', url);

  const html = `
    <p>Please verify your email by clicking the link below:</p>
    <p><a href="${url}">${url}</a></p>
    <p>This link expires in 24 hours.</p>
  `;

  await sendEmail(to, 'Verify your email', html);
  console.log('Verification email sent to:', to);

  return { url };
}

export async function sendPasswordResetEmail(to: string, token: string) {
  const url = `${BASE_URL}/reset-password?token=${encodeURIComponent(token)}`;

  const html = `
    <p>You requested a password reset.</p>
    <p><a href="${url}">${url}</a></p>
    <p>This link expires in 1 hour.</p>
  `;

  await sendEmail(to, 'Reset your password', html);

  return { url };
}
