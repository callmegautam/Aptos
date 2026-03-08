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
      from: 'onboarding@resend.dev',
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

export async function sendVerificationEmail(to: string, otp: string) {
  // const url = `${BASE_URL}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  // console.log('Verification email URL:', url);

  // const html = `Your OTP is ${otp}`;

  const html = `
  <!DOCTYPE html>

<html>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f6f8;padding:40px 0;">
<tr>
<td align="center">

<table width="500" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;padding:35px;box-shadow:0 4px 12px rgba(0,0,0,0.08);text-align:center;">

<tr>
<td style="font-size:22px;font-weight:bold;color:#2d6cdf;padding-bottom:10px;">
${'Aptos Inc.'}
</td>
</tr>

<tr>
<td style="font-size:22px;font-weight:600;color:#333;padding-bottom:10px;">
Your Verification Code
</td>
</tr>

<tr>
<td style="font-size:14px;color:#555;line-height:1.6;padding-bottom:20px;">
Use the following One-Time Password (OTP) to complete your verification.
</td>
</tr>

<tr>
<td align="center">
<div style="display:inline-block;background:#f1f5ff;border:2px dashed #2d6cdf;padding:18px 28px;border-radius:8px;font-size:32px;font-weight:bold;letter-spacing:6px;color:#2d6cdf;">
${otp}
</div>
</td>
</tr>

<tr>
<td style="font-size:14px;color:#555;line-height:1.6;padding-top:20px;">
This code will expire in <strong>5 minutes</strong>.
</td>
</tr>

<tr>
<td style="font-size:13px;color:#888;line-height:1.6;padding-top:20px;">
For security reasons, never share this code with anyone.  
If you did not request this code, please ignore this email.
</td>
</tr>

<tr>
<td style="font-size:12px;color:#aaa;padding-top:25px;">
© ${new Date().getFullYear()} Aptos Inc. All rights reserved.
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
  `;

  await sendEmail(to, 'Your OTP', html);
  console.log('OTP sent to:', to);

  return { otp };
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
