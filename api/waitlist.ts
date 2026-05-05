import type { VercelRequest, VercelResponse } from '@vercel/node';

const SHEETS_URL = process.env.GOOGLE_SHEETS_URL
  || 'https://script.google.com/macros/s/AKfycbxVbMu5HZ0aEXgqrGJ4IJpZJuFwnfCwg7B3JLYH0vi-tulgogrYP1oYZyG8VEqGLhYRVQ/exec';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const query = new URLSearchParams(req.query as Record<string, string>).toString();
  const url = `${SHEETS_URL}?${query}`;

  console.log('[Waitlist Proxy] Forwarding to:', url.substring(0, 60) + '...');

  try {
    const response = await fetch(url, { redirect: 'follow' });
    const body = await response.text();
    console.log('[Waitlist Proxy] Google responded:', response.status, body.substring(0, 200));

    if (body.includes('error') || body.includes('Sorry, unable to open')) {
      return res.status(500).json({ error: 'Google Sheets error', details: body.substring(0, 500) });
    }

    return res.status(200).json({ result: 'ok' });
  } catch (err) {
    console.error('[Waitlist Proxy] Fetch error:', err);
    return res.status(502).json({ error: 'Failed to submit to Google Sheets' });
  }
}
