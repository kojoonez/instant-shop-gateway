import { supabase } from '@/integrations/supabase/client';

export type WaitlistSegment = 'business' | 'user' | 'driver';

const DISPOSEABLE_DOMAINS = new Set([
  'mailinator.com', 'guerrillamail.com', 'temp-mail.org', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'trashmail.com', '10minutemail.com', 'tempmail.net',
  'fakeinbox.com', 'mailnesia.com', 'maildrop.cc', 'harakirimail.com',
  '33mail.com', 'getnada.com', 'mohmal.com', 'emailondeck.com',
  'tempmailaddress.com', 'disposableemailaddresses.emailmiser.com',
  'mailnull.com', 'spamgourmet.com', 'mailexpire.com', 'tempinbox.com',
  'mytemp.email', 'discard.email', 'discardmail.com', 'discardmail.de',
  'guerrillamail.info', 'guerrillamail.net', 'guerrillamail.org',
  'guerrillamail.de', 'spam4.me', 'mailcatch.com', 'burnermail.io',
]);

const BLOCKED_LOCAL_PARTS = [
  'test', 'temp', 'fake', 'dummy', 'demo', 'sample', 'example', 
  'abc', '123', 'aaa', 'xxx', 'noreply', 'no-reply', 'admin', 'user', 'guest',
  'tester', 'test1', 'test2', 'test3', 'temp1', 'temp2', 'fake1'
];

const INVALID_DOMAINS = [
  'example.com', 'example.org', 'example.net',
  'test.com', 'test.org', 'test.net',
  'domain.com', 'domain.org', 'domain.net',
  'localhost', 'mail.com',
];

export function validateEmail(email: string): { valid: boolean; error?: string } {
  const trimmed = email.trim().toLowerCase();
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { valid: false, error: 'Invalid email format' };
  }

  const [localPart, domain] = trimmed.split('@');

  if (localPart.length < 2) {
    return { valid: false, error: 'Email address is too short' };
  }

  if (INVALID_DOMAINS.includes(domain)) {
    return { valid: false, error: `${domain} is not a valid email domain` };
  }

  if (DISPOSEABLE_DOMAINS.has(domain)) {
    return { valid: false, error: 'Disposable email addresses are not allowed' };
  }

  for (const blocked of BLOCKED_LOCAL_PARTS) {
    if (localPart.startsWith(blocked) || localPart === blocked) {
      return { valid: false, error: 'Please use a valid personal or business email address' };
    }
  }

  if (/^[\d]+$/.test(localPart)) {
    return { valid: false, error: 'Please use a valid personal or business email address' };
  }

  if (!domain.includes('.') || domain.split('.').length < 2) {
    return { valid: false, error: 'Invalid email domain' };
  }

  const tld = domain.split('.').pop();
  if (tld && tld.length < 2) {
    return { valid: false, error: 'Invalid email domain' };
  }

  return { valid: true };
}

export async function checkEmailExists(email: string): Promise<{ exists: boolean; segment?: string }> {
  try {
    const { data, error } = await supabase
      .from('waitlist_signups')
      .select('email, segment')
      .eq('email', email.trim().toLowerCase())
      .maybeSingle();

    if (error) throw error;
    return { exists: !!data, segment: data?.segment };
  } catch (err) {
    console.error('[Waitlist] Email check failed:', err);
    return { exists: false };
  }
}

export async function joinWaitlist(params: {
  segment: WaitlistSegment;
  email: string;
  phone?: string;
  fullName?: string;
  businessName?: string;
  notes?: string;
  countryCode: string;
  countryName: string;
  vehicleType?: string;
}): Promise<{ error: Error | null; duplicate: boolean }> {
  const validation = validateEmail(params.email);
  if (!validation.valid) {
    console.error('[Waitlist] Rejected invalid email:', params.email, validation.error);
    return { error: new Error(validation.error || 'Invalid email'), duplicate: false };
  }

  try {
    const { error } = await supabase
      .from('waitlist_signups')
      .insert({
        segment: params.segment,
        email: params.email.trim().toLowerCase(),
        phone: params.phone?.trim() || null,
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
