import helmet from 'helmet';

// Comprehensive security configuration using Helmet
export const securityConfig = helmet({
  // Content Security Policy - Prevents XSS attacks
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind CSS
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Vite HMR
        "'unsafe-eval'", // Required for Vite development
        "https://cdn.jsdelivr.net"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://images.unsplash.com",
        "https://api.dicebear.com",
        "https://via.placeholder.com",
        "https://cdn.jsdelivr.net"
      ],
      connectSrc: [
        "'self'",
        "https://*.supabase.co",
        "wss://*.supabase.co",
        "https://ipapi.co",
        "https://get.geojs.io",
        "https://www.google-analytics.com",
        "https://*.google-analytics.com",
        "https://analytics.google.com",
        "https://www.googletagmanager.com",
        "https://stats.g.doubleclick.net",
        "http://127.0.0.1:54321",
        "ws://127.0.0.1:54321",
      ],
      mediaSrc: [
        "'self'",
        "data:",
        "blob:"
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'none'"], // Blocks all iframes including ads
      upgradeInsecureRequests: []
    },
    reportOnly: false
  },

  // Cross-Origin Embedder Policy - Prevents embedding in frames
  crossOriginEmbedderPolicy: { policy: "require-corp" },

  // Cross-Origin Opener Policy - Controls cross-origin window access
  crossOriginOpenerPolicy: { policy: "same-origin" },

  // Cross-Origin Resource Policy - Controls cross-origin resource access
  crossOriginResourcePolicy: { policy: "cross-origin" },

  // DNS Prefetch Control - Prevents DNS prefetching
  dnsPrefetchControl: { allow: false },

  // Expect-CT - Certificate Transparency
  expectCt: {
    maxAge: 86400,
    enforce: true
  },

  // Feature Policy / Permissions Policy - Controls browser features
  permissionsPolicy: {
    accelerometer: [],
    ambientLightSensor: [],
    autoplay: ["self"], // Allow autoplay from your own domain, block third-party
    battery: [],
    camera: [],
    crossOriginIsolated: [],
    displayCapture: [],
    documentDomain: [],
    encryptedMedia: [],
    executionWhileNotRendered: [],
    executionWhileOutOfViewport: [],
    fullscreen: ["self"],
    geolocation: [],
    gyroscope: [],
    keyboardMap: [],
    magnetometer: [],
    microphone: [],
    midi: [],
    navigationOverride: [],
    payment: [],
    pictureInPicture: [],
    publickeyCredentialsGet: [],
    screenWakeLock: [],
    syncXhr: [],
    usb: [],
    webShare: [],
    xrSpatialTracking: []
  },

  // Hide X-Powered-By header
  hidePoweredBy: true,

  // HSTS - HTTP Strict Transport Security
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },

  // IE No Open - Prevents IE from executing downloads
  ieNoOpen: true,

  // No Sniff - Prevents MIME type sniffing
  noSniff: true,

  // Origin Agent Cluster - Isolates origins
  originAgentCluster: true,

  // Referrer Policy - Controls referrer information
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },

  // X-DNS-Prefetch-Control - Controls DNS prefetching
  xssFilter: true
});

// Additional security middleware for development
export const developmentSecurityConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Tailwind CSS
        "https://fonts.googleapis.com"
      ],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for Vite HMR
        "'unsafe-eval'" // Required for Vite development
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "data:"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "https://images.unsplash.com",
        "https://api.dicebear.com"
      ],
      connectSrc: [
        "'self'",
        "https://*.supabase.co",
        "wss://*.supabase.co",
        "https://ipapi.co",
        "https://get.geojs.io",
        "http://127.0.0.1:54321",
        "ws://127.0.0.1:54321",
        "http://localhost:8080",
        "http://localhost:8081",
      ],
      mediaSrc: [
        "'self'",
        "data:",
        "blob:"
      ],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      frameSrc: ["'none'"] // Blocks all iframes including ads
    },
    reportOnly: false
  },
  crossOriginEmbedderPolicy: false, // Disabled for development
  crossOriginOpenerPolicy: { policy: "unsafe-none" }, // Relaxed for development
  crossOriginResourcePolicy: { policy: "cross-origin" },
  dnsPrefetchControl: { allow: true }, // Allowed for development
  hidePoweredBy: true,
  hsts: false, // Disabled for development
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: false, // Disabled for development
  referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  xssFilter: true
});

// Security headers for API responses
export const apiSecurityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
};

// Rate limiting configuration
export const rateLimitConfig = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
};

// CORS configuration
export const corsConfig = {
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com', 'https://www.yourdomain.com']
    : ['http://localhost:8080', 'http://localhost:8081', 'http://127.0.0.1:8080', 'http://127.0.0.1:8081'],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};
