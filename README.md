## Cravy Marketing Website

A fast, accessible, conversion‑focused marketing site for Cravy.

### Development

```sh
npm install
npm run dev
```

Open the URL printed by Vite (e.g., http://127.0.0.1:5189).

### Build

```sh
npm run build
npm run preview
```

### Deployment 🚀

This project is ready to deploy to multiple platforms. See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for detailed instructions.

**Quick Deploy Options:**

1. **Vercel** (Recommended - Easiest):
   ```bash
   npm i -g vercel
   vercel
   ```

2. **Netlify**:
   ```bash
   npm i -g netlify-cli
   netlify deploy --prod
   ```

3. **Cloudflare Pages**: Connect via GitHub in Cloudflare dashboard

4. **GitHub Pages**: Push to main branch (auto-deploys via GitHub Actions)

**Environment Variables Required:**
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

### Tech
- Vite
- React + TypeScript
- Tailwind CSS + shadcn/ui
- Supabase (Backend & Database)

### Custom Domain Setup 🌐

If you have a custom domain (e.g., `www.cray.eu` from Namecheap), see **[DOMAIN_SETUP.md](./DOMAIN_SETUP.md)** for step-by-step instructions on connecting it to your hosting platform.

### Configuration
- Edit `src/config/site.ts` for app store links, contact, and GTM ID.
- Public assets (logos, icons) live in `public/`.
- Environment variables: Create `.env.local` with your Supabase credentials (see `SUPABASE_CLOUD_SETUP.md`)
