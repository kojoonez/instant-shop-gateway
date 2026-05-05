/** ISO 3166-1 alpha-2 codes shown on waitlist (plus OT = other). Order: priority markets first. */
export const WAITLIST_COUNTRY_CODES = [
  'GH',
  'NG',
  'KE',
  'ZA',
  'CI',
  'SN',
  'UG',
  'TZ',
  'RW',
  'FI',
  'GB',
  'US',
  'OT',
] as const;

export type WaitlistCountryCode = (typeof WAITLIST_COUNTRY_CODES)[number];
