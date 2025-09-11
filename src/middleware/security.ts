// Security middleware for Vite development server
import type { Connect } from 'vite';

// Security headers middleware
export const securityHeaders: Connect.NextHandleFunction = (req, res, next) => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // Development-specific headers
  if (process.env.NODE_ENV === 'development') {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  } else {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  }
  
  next();
};

// CORS middleware for development
export const corsMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:8081',
    'http://127.0.0.1:8080',
    'http://127.0.0.1:8081'
  ];

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  
  if (req.method === 'OPTIONS') {
    res.statusCode = 200;
    res.end();
    return;
  }
  
  next();
};

// Rate limiting middleware (simple in-memory store for development)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

export const rateLimitMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  const clientIP = req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 minutes
  const maxRequests = 100;

  const clientData = requestCounts.get(clientIP);
  
  if (!clientData || now > clientData.resetTime) {
    requestCounts.set(clientIP, { count: 1, resetTime: now + windowMs });
    next();
    return;
  }

  if (clientData.count >= maxRequests) {
    res.statusCode = 429;
    res.setHeader('Retry-After', Math.ceil((clientData.resetTime - now) / 1000));
    res.end('Too many requests from this IP, please try again later.');
    return;
  }

  clientData.count++;
  next();
};

// Input validation middleware
export const inputValidationMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  // Check for suspicious patterns in URL and headers
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /onload=/i,
    /onerror=/i,
    /eval\(/i,
    /expression\(/i,
    /url\(/i,
    /@import/i,
    /\.\.\//g, // Directory traversal
    /union\s+select/i,
    /drop\s+table/i,
    /insert\s+into/i,
    /delete\s+from/i
  ];

  const url = req.url || '';
  const userAgent = req.headers['user-agent'] || '';
  const referer = req.headers.referer || '';

  const allInputs = [url, userAgent, referer].join(' ');

  for (const pattern of suspiciousPatterns) {
    if (pattern.test(allInputs)) {
      res.statusCode = 400;
      res.end('Bad Request: Suspicious input detected');
      return;
    }
  }

  next();
};

// Security logging middleware
export const securityLoggingMiddleware: Connect.NextHandleFunction = (req, res, next) => {
  const startTime = Date.now();
  const clientIP = req.socket.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    
    // Log security-relevant events
    if (statusCode >= 400) {
      console.warn(`[SECURITY] ${clientIP} - ${req.method} ${req.url} - ${statusCode} - ${duration}ms - ${userAgent}`);
    }
    
    // Log suspicious patterns
    if (statusCode === 429 || statusCode === 400) {
      console.error(`[SECURITY ALERT] ${clientIP} - ${req.method} ${req.url} - ${statusCode} - ${userAgent}`);
    }
  });

  next();
};
