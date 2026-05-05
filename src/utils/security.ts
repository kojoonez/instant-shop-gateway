// Client-side security utilities

// Escape text for safe HTML insertion (treat as text, not markup)
export const sanitizeHTML = (html: string): string => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Light sanitization for plain-text fields. Does not strip substrings like "script"
 * inside legitimate words (e.g. "description"). Prefer validation + server-side rules for real enforcement.
 */
export const sanitizeInput = (input: string): string => {
  return input
    .replace(/\0/g, '')
    .replace(/[\u0001-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .replace(/[<>]/g, '')
    .replace(/^[\s\uFEFF]*javascript:/i, '')
    .trim();
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL format
export const isValidURL = (url: string): boolean => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

// Generate secure random string
export const generateSecureToken = (length: number = 32): string => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('');
};

// Check if running in secure context
export const isSecureContext = (): boolean => {
  return window.isSecureContext;
};

// Validate file type for uploads
export const isValidFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.includes(file.type);
};

// Validate file size
export const isValidFileSize = (file: File, maxSizeInMB: number): boolean => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return file.size <= maxSizeInBytes;
};

const logCspViolation = (event: SecurityPolicyViolationEvent) => {
  if (import.meta.env.DEV) {
    console.warn('[CSP]', {
      blockedURI: event.blockedURI,
      violatedDirective: event.violatedDirective,
      sourceFile: event.sourceFile,
      lineNumber: event.lineNumber,
    });
  }
};

/**
 * Optional client hooks. Avoids disabling devtools, clearing storage, or posting to non-existent endpoints
 * (those patterns harm UX and do not meaningfully improve security for a static SPA).
 */
export const initializeSecurity = () => {
  document.addEventListener('securitypolicyviolation', logCspViolation);
};

// Security headers for API requests (informational; browser may ignore on fetch)
export const getSecureHeaders = () => {
  return {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  };
};

// Validate CSRF token
export const validateCSRFToken = (token: string): boolean => {
  return typeof token === 'string' && token.length > 0;
};

// Rate limiting for client-side requests
class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];

    const validRequests = requests.filter((time) => now - time < this.windowMs);

    if (validRequests.length >= this.maxRequests) {
      return false;
    }

    validRequests.push(now);
    this.requests.set(key, validRequests);
    return true;
  }
}

export const clientRateLimiter = new ClientRateLimiter(10, 60000);
