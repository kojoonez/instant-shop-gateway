# 🔧 Fix GitHub Pages "Get Pages site failed" Error

## The Problem
You're seeing: `Error: Get Pages site failed. Please verify` and `HttpError: Not Found`

This means **GitHub Pages is not enabled** for your repository yet.

## ✅ Quick Fix (2 minutes)

### Step 1: Enable GitHub Pages

1. **Go to your repository on GitHub:**
   - https://github.com/kojoonez/instant-shop-gateway

2. **Navigate to Settings:**
   - Click the "Settings" tab (top of the repository)

3. **Go to Pages section:**
   - Scroll down to "Pages" in the left sidebar
   - Or go directly to: https://github.com/kojoonez/instant-shop-gateway/settings/pages

4. **Configure Pages:**
   - Under "Source", select: **"GitHub Actions"** (NOT "Deploy from a branch")
   - Click "Save"

### Step 2: Re-run the Workflow

1. **Go to Actions:**
   - Click the "Actions" tab
   - Or go to: https://github.com/kojoonez/instant-shop-gateway/actions

2. **Re-run the failed workflow:**
   - Click on the latest failed workflow run
   - Click "Re-run all jobs" button
   - Or make a small commit and push to trigger a new run

### Step 3: Wait for Deployment

- The workflow should now succeed
- Your site will be available at: `https://kojoonez.github.io/instant-shop-gateway/`

## 📝 Important Notes

### Repository Name Matters
If your repository name is `instant-shop-gateway`, your site URL will be:
- `https://kojoonez.github.io/instant-shop-gateway/`

### Base Path Configuration
If you want to use a custom domain or different base path, update `vite.config.ts`:

```typescript
export default defineConfig({
  base: '/instant-shop-gateway/', // For GitHub Pages subdirectory
  // OR
  base: '/', // For custom domain
  // ... rest of config
});
```

### Environment Variables
Make sure you've added these secrets in GitHub:
- Go to: Settings → Secrets and variables → Actions
- Add:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

## ✅ Verification Checklist

After enabling Pages:
- [ ] GitHub Pages is enabled (Settings → Pages → Source: "GitHub Actions")
- [ ] Environment variables are set (Settings → Secrets → Actions)
- [ ] Workflow runs successfully
- [ ] Site is accessible at `https://kojoonez.github.io/instant-shop-gateway/`

## 🚨 Still Having Issues?

If the error persists after enabling Pages:

1. **Check repository visibility:**
   - Private repos need GitHub Pro/Team for Pages
   - Public repos work with free accounts

2. **Verify workflow permissions:**
   - The workflow already has correct permissions (`pages: write`, `id-token: write`)

3. **Check the workflow file:**
   - Make sure `.github/workflows/deploy.yml` exists and is correct

4. **Wait a few minutes:**
   - Sometimes GitHub needs a moment to set up Pages

## 🎯 Alternative: Use Vercel Instead

If GitHub Pages continues to have issues, you're already set up for Vercel (which is easier):
- Your site is already deployed on Vercel
- Just use: `https://instant-shop-gateway-*.vercel.app`
- Or connect your custom domain `cravy.eu` to Vercel

See `DEPLOYMENT.md` for Vercel setup instructions.

