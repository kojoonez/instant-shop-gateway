import { supabase } from '@/integrations/supabase/client';

export async function submitCreatorApplication(params: {
  fullName: string;
  email: string;
  phone?: string;
  socialLinks?: string;
  contentType?: string;
  countryCode: string;
  countryName: string;
  description?: string;
}): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase
      .from('creator_applications')
      .insert({
        full_name: params.fullName.trim(),
        email: params.email.trim().toLowerCase(),
        phone: params.phone?.trim() || null,
        social_links: params.socialLinks?.trim() || null,
        content_type: params.contentType?.trim() || null,
        country_code: params.countryCode,
        country_name: params.countryName,
        description: params.description?.trim() || null,
      });

    if (error) {
      return { error: new Error(error.message) };
    }

    return { error: null };
  } catch (err) {
    console.error('[CreatorApp] Submission failed:', err);
    return { error: err instanceof Error ? err : new Error(String(err)) };
  }
}
