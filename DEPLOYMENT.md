# 🚀 Deployment Guide

This guide will help you deploy your Cravy marketing website to various hosting platforms.

## Prerequisites

Before deploying, make sure you have:

1. **Built the project locally** to test:
   ```bash
   npm run build
   npm run preview
   ```

2. **Set up Supabase Cloud** (if not already done):
   - Follow the instructions in `SUPABASE_CLOUD_SETUP.md`
   - Get your `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Environment Variables** needed:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anon/public key

---

## Option 1: Vercel (Recommended - Easiest) ⚡

Vercel is the easiest and fastest way to deploy React apps with zero configuration.

### Steps:

1. **Install Vercel CLI** (optional, you can also use the web interface):
   ```bash
   npm i -g vercel
   ```

2. **Deploy via CLI**:
   ```bash
   vercel
   ```
   - Follow the prompts
   - When asked for environment variables, add:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

3. **Or Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository
   - Add environment variables in the project settings
   - Click "Deploy"

4. **Configure Environment Variables**:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables"
   - Add:
     - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-anon-key-here`

5. **Custom Domain** (optional):
   - Go to Project Settings > Domains
   - Add your custom domain
   - Follow DNS configuration instructions

**That's it!** Your site will be live at `https://your-project.vercel.app`

---

## Option 2: Netlify 🌐

Netlify is another excellent option with great developer experience.

### Steps:

1. **Install Netlify CLI** (optional):
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy via CLI**:
   ```bash
   netlify deploy --prod
   ```
   - Follow the prompts
   - Login if needed
   - Add environment variables when prompted

3. **Or Deploy via GitHub**:
   - Push your code to GitHub
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Select your GitHub repository
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - Click "Deploy site"

4. **Configure Environment Variables**:
   - Go to Site settings > Environment variables
   - Add:
     - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-anon-key-here`
   - Redeploy after adding variables

5. **Custom Domain**:
   - Go to Domain settings
   - Add your custom domain
   - Configure DNS as instructed

**Your site will be live at `https://your-site.netlify.app`**

---

## Option 3: Cloudflare Pages ☁️

Cloudflare Pages offers fast global CDN and free hosting.

### Steps:

1. **Push to GitHub** (if not already done)

2. **Deploy via Cloudflare Dashboard**:
   - Go to [dash.cloudflare.com](https://dash.cloudflare.com)
   - Navigate to "Pages" > "Create a project"
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - Framework preset: `Vite`
     - Build command: `npm run build`
     - Build output directory: `dist`
   - Click "Save and Deploy"

3. **Configure Environment Variables**:
   - Go to your Pages project settings
   - Navigate to "Environment variables"
   - Add:
     - `VITE_SUPABASE_URL` = `https://your-project-id.supabase.co`
     - `VITE_SUPABASE_ANON_KEY` = `your-anon-key-here`
   - Redeploy after adding variables

4. **Custom Domain**:
   - Go to "Custom domains"
   - Add your domain
   - Update DNS records as shown

**Your site will be live at `https://your-project.pages.dev`**

---

## Option 4: GitHub Pages 📄

Free hosting directly from your GitHub repository.

### Steps:

1. **Update vite.config.ts** (if needed):
   - Add `base: '/your-repo-name/'` if deploying to a subdirectory
   - Or set `base: '/'` for custom domain

2. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

3. **Set up GitHub Actions**:
   - The workflow file (`.github/workflows/deploy.yml`) is already created
   - Go to your GitHub repository
   - Navigate to Settings > Secrets and variables > Actions
   - Add secrets:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`

4. **Enable GitHub Pages**:
   - Go to Settings > Pages
   - Source: "GitHub Actions"
   - Save

5. **Trigger Deployment**:
   - Push to `main` branch (or merge a PR)
   - GitHub Actions will automatically build and deploy

**Your site will be live at `https://your-username.github.io/your-repo-name`**

---

## Option 5: Traditional Hosting (VPS/Shared Hosting) 🖥️

If you have a VPS or shared hosting, you can deploy manually.

### Steps:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload the `dist` folder**:
   - Upload all contents of the `dist` folder to your web server
   - Place them in your web root (e.g., `public_html` or `www`)

3. **Configure your web server**:
   - **Apache**: Create `.htaccess` file:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```
   
   - **Nginx**: Update your config:
     ```nginx
     location / {
       try_files $uri $uri/ /index.html;
     }
     ```

4. **Set Environment Variables**:
   - Since you can't use `.env` files in static hosting, you'll need to:
     - Either hardcode them (not recommended for production)
     - Or use a build-time replacement script
     - Or use a config file that's loaded at runtime

---

## Post-Deployment Checklist ✅

After deploying, make sure to:

- [ ] Test all pages and routes
- [ ] Verify Supabase connection works
- [ ] Test authentication (if applicable)
- [ ] Test messaging/chat features
- [ ] Check mobile responsiveness
- [ ] Verify SEO meta tags
- [ ] Test form submissions
- [ ] Check analytics (if configured)
- [ ] Set up custom domain (if desired)
- [ ] Enable HTTPS (should be automatic on most platforms)
- [ ] Test performance (PageSpeed Insights)

---

## Troubleshooting 🔧

### Build Fails

- Check that all dependencies are in `package.json`
- Ensure Node.js version is compatible (v18+)
- Check build logs for specific errors

### Environment Variables Not Working

- Make sure variables start with `VITE_` prefix
- Redeploy after adding environment variables
- Check that variables are set in production environment (not just development)

### Routes Not Working (404 errors)

- Ensure your hosting platform is configured for SPA routing
- Check that redirect rules are set up (see `vercel.json` or `netlify.toml`)

### Supabase Connection Issues

- Verify environment variables are correct
- Check Supabase project is active
- Ensure CORS is configured in Supabase dashboard
- Check browser console for specific errors

---

## Need Help? 💬

- Check the platform-specific documentation
- Review error logs in your hosting dashboard
- Test locally with `npm run build && npm run preview`
- Check Supabase dashboard for connection issues

---

## Quick Reference

| Platform | Free Tier | Custom Domain | Build Time | Best For |
|----------|-----------|---------------|------------|----------|
| Vercel | ✅ Yes | ✅ Yes | ~1-2 min | Easiest setup |
| Netlify | ✅ Yes | ✅ Yes | ~2-3 min | Great DX |
| Cloudflare Pages | ✅ Yes | ✅ Yes | ~1-2 min | Fastest CDN |
| GitHub Pages | ✅ Yes | ✅ Yes | ~3-5 min | Free & Simple |

Good luck with your deployment! 🚀

