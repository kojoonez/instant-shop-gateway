export type WaitlistSegment = 'business' | 'user' | 'driver';

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

    const queryString = Object.entries(payload)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join('&');

    const res = await fetch(`/api/waitlist?${queryString}`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server error: ${res.status}`);
    }

    return { error: null, duplicate: false };
  } catch (err) {
    console.error('[Waitlist] Submission failed:', err);
    return { error: err instanceof Error ? err : new Error(String(err)), duplicate: false };
  }
}
