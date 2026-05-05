import { supabase } from '@/integrations/supabase/client';

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
    const { error } = await supabase
      .from('waitlist_signups')
      .insert({
        segment: params.segment,
        email: params.email.trim().toLowerCase(),
        full_name: params.fullName?.trim() || null,
        business_name: params.businessName?.trim() || null,
        vehicle_type: params.vehicleType?.trim() || null,
        notes: params.notes?.trim() || null,
        country_code: params.countryCode,
        country_name: params.countryName,
      });

    if (error) {
      if (error.code === '23505') {
        return { error: null, duplicate: true };
      }
      return { error: new Error(error.message), duplicate: false };
    }

    return { error: null, duplicate: false };
  } catch (err) {
    console.error('[Waitlist] Submission failed:', err);
    return { error: err instanceof Error ? err : new Error(String(err)), duplicate: false };
  }
}
