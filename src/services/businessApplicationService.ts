import { supabase } from '@/integrations/supabase/client';

export async function submitBusinessApplication(params: {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  category?: string;
  countryCode: string;
  countryName: string;
  description?: string;
}): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('business_applications')
      .insert({
        business_name: params.businessName.trim(),
        contact_name: params.contactName.trim(),
        email: params.email.trim().toLowerCase(),
        phone: params.phone?.trim() || null,
        category: params.category?.trim() || null,
        country_code: params.countryCode,
        country_name: params.countryName,
        description: params.description?.trim() || null,
      });

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('[BusinessApp] Submission failed:', err);
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}
