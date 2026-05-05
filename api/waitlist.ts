import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHEETS_URL = process.env.GOOGLE_SHEETS_URL
  || 'https://script.google.com/macros/s/AKfycbxVbMu5HZ0aEXgqrGJ4IJpZJuFwnfCwg7B3JLYH0vi-tulgogrYP1oYZyG8VEqGLhYRVQ/exec';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${SHEETS_URL}?${query}`;

  try {
    await fetch(url, { redirect: 'follow' });
    return res.status(200).json({ result: 'ok' });
  } catch (err) {
    console.error('[Waitlist Proxy] Error:', err);
    return res.status(502).json({ error: 'Failed to submit to Google Sheets' });
  }
}
