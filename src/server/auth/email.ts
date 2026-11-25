import 'server-only';

type TransactionalEmail = { to: string; subject: string; text: string; html: string; idempotencyKey: string };

export async function sendTransactionalEmail(message: TransactionalEmail) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  if (!apiKey || !from) return false;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': message.idempotencyKey,
    },
    body: JSON.stringify({ from, to: [message.to], subject: message.subject, text: message.text, html: message.html }),
    signal: AbortSignal.timeout(8000),
    cache: 'no-store',
  });
  return response.ok;
}

export function appOrigin() {
  const configured = process.env.NEXTAUTH_URL;
  if (!configured) throw new Error('NEXTAUTH_URL is not configured.');
  const url = new URL(configured);
  if (process.env.NODE_ENV === 'production' && url.protocol !== 'https:') throw new Error('NEXTAUTH_URL must use HTTPS in production.');
  return url.origin;
}

export function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]!);
}
