// Waitlist service — submits to Google Sheets via a Google Apps Script Web App.
//
// SETUP INSTRUCTIONS:
// 1. Open Google Sheets and create a sheet named "Waitlist"
// 2. Go to Extensions → Apps Script
// 3. Paste the Apps Script code from GOOGLE_SHEETS_SETUP.md
// 4. Deploy as Web App (Execute as: Me, Who has access: Anyone)
// 5. Copy the Web App URL and set it as VITE_GOOGLE_SHEETS_URL in your .env
//
// NOTE: After any Apps Script code change, create a NEW deployment version.

export type WaitlistSegment = 'business' | 'user' | 'driver';

const SHEETS_URL = (import.meta.env.VITE_GOOGLE_SHEETS_URL as string | undefined)
  || 'https://script.google.com/macros/s/AKfycbxVbMu5HZ0aEXgqrGJ4IJpZJuFwnfCwg7B3JLYH0vi-tulgogrYP1oYZyG8VEqGLhYRVQ/exec';

// Debug: log whether the URL was picked up from env or fallback
if (typeof window !== 'undefined') {
  console.log('[Waitlist] Sheets URL source:', import.meta.env.VITE_GOOGLE_SHEETS_URL ? 'env' : 'fallback');
}

export async function joinWaitlist(params: {
  segment: WaitlistSegment;
  email: string;
  fullName?: string;
  businessName?: string;
  notes?: string;
  countryCode: string;
  countryName: string;
  vehicleType?: string;
}): Promise<{ error: Error | null; duplicate: boolean }> {
  if (!SHEETS_URL) {
    console.warn('[Waitlist] No Google Sheets URL configured. Submission skipped.');
    return { error: new Error('No Google Sheets URL configured'), duplicate: false };
  }

  try {
    const payload = {
      segment: params.segment,
      email: params.email.trim().toLowerCase(),
      fullName: params.fullName?.trim() || '',
      businessName: params.businessName?.trim() || '',
      vehicleType: params.vehicleType?.trim() || '',
      notes: params.notes?.trim() || '',
      countryCode: params.countryCode,
      countryName: params.countryName,
      submittedAt: new Date().toISOString(),
    };

    console.log('[Waitlist] Submitting to:', SHEETS_URL.substring(0, 50) + '...');
    console.log('[Waitlist] Payload:', JSON.stringify(payload));

    const queryString = Object.entries(payload)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    await fetch(`${SHEETS_URL}?${queryString}`, {
      method: 'GET',
      mode: 'no-cors',
    });

    console.log('[Waitlist] Submission successful');
    return { error: null, duplicate: false };
  } catch (err) {
    console.error('[Waitlist] Submission failed:', err);
    return { error: err instanceof Error ? err : new Error(String(err)), duplicate: false };
  }
}
