export type IpCountryResult = {
  countryCode: string;
  countryName: string;
};

function withTimeout(ms: number): AbortSignal {
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

/**
 * Best-effort country from IP (HTTPS, CORS-friendly public APIs).
 * Falls back to null if both providers fail or are blocked.
 */
export async function detectCountryByIp(): Promise<IpCountryResult | null> {
  try {
    const r = await fetch('https://ipapi.co/json/', { signal: withTimeout(8000) });
    if (r.ok) {
      const j = (await r.json()) as Record<string, unknown>;
      if (j.error) throw new Error(String(j.reason ?? 'ipapi error'));
      const code = j.country_code;
      if (typeof code === 'string' && code.length === 2) {
        return {
          countryCode: code.toUpperCase(),
          countryName: typeof j.country_name === 'string' ? j.country_name : code,
        };
      }
    }
  } catch {
    /* try fallback */
  }

  try {
    const r = await fetch('https://get.geojs.io/v1/ip/geo.json', { signal: withTimeout(8000) });
    if (!r.ok) throw new Error('geojs status');
    const j = (await r.json()) as Record<string, unknown>;
    const code = j.country_code;
    if (typeof code === 'string' && code.length >= 2) {
      const cc = code.toUpperCase().slice(0, 2);
      return {
        countryCode: cc,
        countryName: typeof j.country === 'string' ? j.country : cc,
      };
    }
  } catch {
    return null;
  }

  return null;
}
