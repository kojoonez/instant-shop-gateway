import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { 
  securityHeaders, 
  corsMiddleware, 
  rateLimitMiddleware, 
  inputValidationMiddleware, 
  securityLoggingMiddleware 
} from "./src/middleware/security";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages (uncomment if using GitHub Pages)
  // base: '/instant-shop-gateway/',
  // For custom domain or Vercel, use: base: '/',
  server: {
    host: "::",
    port: 8080,
    middlewareMode: false,
    // Add security middleware (only in development)
    configure: (server) => {
      // Only apply middleware in development mode
      if (mode === 'development') {
        server.middlewares.use(securityHeaders);
        server.middlewares.use(corsMiddleware);
        server.middlewares.use(rateLimitMiddleware);
        server.middlewares.use(inputValidationMiddleware);
        server.middlewares.use(securityLoggingMiddleware);
      }
    },
    // Security headers for static files
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
    }
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Security build options
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  // Security environment variables
  define: {
    __SECURITY_MODE__: JSON.stringify(mode),
  },
}));
