# 🌐 Domain Setup Guide - Namecheap (www.cray.eu)

This guide will help you connect your Namecheap domain `www.cray.eu` to your hosting platform.

## Prerequisites

- Domain: `www.cray.eu` (registered with Namecheap)
- Your website deployed on a hosting platform (Vercel, Netlify, Cloudflare Pages, etc.)

---

## Step 1: Choose Your Hosting Platform

First, deploy your website to one of these platforms:

- **Vercel** (Recommended) - Easiest setup
- **Netlify** - Great alternative
- **Cloudflare Pages** - Fast CDN
- **GitHub Pages** - Free option

See [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment instructions.

---

## Step 2: Get Your Hosting Platform's DNS Records

After deploying, you'll need to get DNS records from your hosting platform:

### For Vercel:
1. Go to your project on Vercel
2. Settings → Domains
3. Add domain: `cray.eu` (without www)
4. Add domain: `www.cray.eu`
5. Vercel will show you DNS records to add

**Vercel typically uses:**
- **A Record**: `76.76.21.21` (or similar IP)
- **CNAME Record**: `cname.vercel-dns.com` (for www subdomain)

### For Netlify:
1. Go to Site settings → Domain management
2. Add custom domain: `cray.eu`
3. Add custom domain: `www.cray.eu`
4. Netlify will show DNS records

**Netlify typically uses:**
- **A Record**: `75.2.60.5` (or similar)
- **CNAME Record**: Points to your Netlify site URL

### For Cloudflare Pages:
1. Go to your Pages project
2. Custom domains → Add domain
3. Add `cray.eu` and `www.cray.eu`
4. Follow the DNS configuration shown

---

## Step 3: Configure DNS in Namecheap

### Option A: Using Namecheap BasicDNS (Recommended for most platforms)

1. **Log in to Namecheap**
   - Go to [namecheap.com](https://www.namecheap.com)
   - Sign in to your account

2. **Navigate to Domain List**
   - Click "Domain List" from the left sidebar
   - Find `cray.eu` and click "Manage"

3. **Go to Advanced DNS**
   - Click on the "Advanced DNS" tab

4. **Remove Default Records** (if any)
   - Delete any existing A records or CNAME records that point to parking pages

5. **Add DNS Records**

   **For the root domain (cray.eu):**
   - **Type**: A Record
   - **Host**: `@` (or leave blank)
   - **Value**: [IP address from your hosting platform]
   - **TTL**: Automatic (or 30 min)
   - Click "Add Record"

   **For www subdomain (www.cray.eu):**
   - **Type**: CNAME Record
   - **Host**: `www`
   - **Value**: [CNAME value from your hosting platform]
   - **TTL**: Automatic (or 30 min)
   - Click "Add Record"

6. **Example Configuration for Vercel:**
   ```
   Type: A Record
   Host: @
   Value: 76.76.21.21
   TTL: Automatic

   Type: CNAME Record
   Host: www
   Value: cname.vercel-dns.com
   TTL: Automatic
   ```

7. **Example Configuration for Netlify:**
   ```
   Type: A Record
   Host: @
   Value: 75.2.60.5
   TTL: Automatic

   Type: CNAME Record
   Host: www
   Value: your-site-name.netlify.app
   TTL: Automatic
   ```

8. **Save Changes**
   - Wait for DNS propagation (can take 5 minutes to 48 hours, usually 1-2 hours)

### Option B: Using Namecheap DNS (if your hosting platform supports it)

Some platforms allow you to use Namecheap's nameservers:

1. **Get Nameservers from Hosting Platform**
   - Your hosting platform will provide nameservers (e.g., `ns1.vercel-dns.com`)

2. **Update Nameservers in Namecheap**
   - Go to Domain List → Manage `cray.eu`
   - Click "Nameservers" dropdown
   - Select "Custom DNS"
   - Enter the nameservers provided by your hosting platform
   - Click "Save"

---

## Step 4: Configure Your Hosting Platform

### For Vercel:

1. Go to your project → Settings → Domains
2. Add both domains:
   - `cray.eu` (root domain)
   - `www.cray.eu` (www subdomain)
3. Vercel will automatically:
   - Set up SSL certificates (HTTPS)
   - Redirect www to non-www (or vice versa, configurable)

### For Netlify:

1. Go to Site settings → Domain management
2. Add custom domain: `cray.eu`
3. Add custom domain: `www.cray.eu`
4. Netlify will:
   - Provision SSL certificates automatically
   - Set up redirects

### For Cloudflare Pages:

1. Go to your Pages project → Custom domains
2. Add `cray.eu` and `www.cray.eu`
3. Cloudflare will handle SSL automatically

---

## Step 5: Verify DNS Propagation

After adding DNS records, verify they're working:

1. **Check DNS Propagation:**
   - Visit [whatsmydns.net](https://www.whatsmydns.net)
   - Enter `cray.eu` and check A record
   - Enter `www.cray.eu` and check CNAME record
   - Wait until records show globally (may take time)

2. **Test Your Domain:**
   - Visit `http://cray.eu` (should redirect to HTTPS)
   - Visit `http://www.cray.eu` (should redirect to HTTPS)
   - Both should show your website

3. **Check SSL Certificate:**
   - Your hosting platform should automatically provision SSL
   - Wait 5-10 minutes after DNS propagation
   - Visit `https://cray.eu` and `https://www.cray.eu`

---

## Step 6: Set Up Redirects (Optional but Recommended)

Most hosting platforms allow you to choose redirect behavior:

- **Redirect www to non-www**: `www.cray.eu` → `cray.eu`
- **Redirect non-www to www**: `cray.eu` → `www.cray.eu`

**Recommended**: Redirect www to non-www (shorter URL)

### Vercel:
- Settings → Domains → Configure
- Choose redirect preference

### Netlify:
- Site settings → Domain management
- Set primary domain
- Configure redirects in `netlify.toml` if needed

---

## Troubleshooting 🔧

### DNS Not Propagating

- **Wait longer**: DNS can take up to 48 hours (usually 1-2 hours)
- **Check records**: Verify you entered the correct values
- **Clear DNS cache**: 
  - Windows: `ipconfig /flushdns`
  - Mac: `sudo dscacheutil -flushcache`
  - Or use Google DNS: 8.8.8.8

### SSL Certificate Not Working

- **Wait**: SSL provisioning takes 5-10 minutes after DNS propagation
- **Check hosting platform**: Ensure domain is verified
- **Force HTTPS**: Your hosting platform should handle this automatically

### Domain Shows "Not Found" or "Parked"

- **DNS not propagated**: Wait longer or check DNS records
- **Wrong DNS records**: Verify you're using the correct values from your hosting platform
- **Nameservers**: If using custom nameservers, ensure they're correct

### Only One Domain Works (www or non-www)

- **Add both domains**: Make sure you added both `cray.eu` and `www.cray.eu` to your hosting platform
- **Check DNS records**: Ensure both A record and CNAME record are set correctly
- **Check redirects**: Verify redirect configuration in hosting platform

---

## Quick Reference: Namecheap DNS Records

### For Vercel:
```
A Record:
Host: @
Value: 76.76.21.21
TTL: Automatic

CNAME Record:
Host: www
Value: cname.vercel-dns.com
TTL: Automatic
```

### For Netlify:
```
A Record:
Host: @
Value: 75.2.60.5
TTL: Automatic

CNAME Record:
Host: www
Value: your-site.netlify.app
TTL: Automatic
```

### For Cloudflare Pages:
```
A Record:
Host: @
Value: [IP from Cloudflare]
TTL: Automatic

CNAME Record:
Host: www
Value: [CNAME from Cloudflare]
TTL: Automatic
```

---

## Security Checklist ✅

After setup, verify:

- [ ] HTTPS is working (`https://cray.eu` and `https://www.cray.eu`)
- [ ] SSL certificate is valid (green padlock in browser)
- [ ] Both www and non-www work
- [ ] Redirects are configured correctly
- [ ] Website loads correctly
- [ ] All pages/routes work
- [ ] Supabase connection works (if applicable)

---

## Need Help? 💬

- **Namecheap Support**: [support.namecheap.com](https://support.namecheap.com)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify Docs**: [docs.netlify.com](https://docs.netlify.com)
- **DNS Checker**: [whatsmydns.net](https://www.whatsmydns.net)

---

## Next Steps

1. ✅ Deploy your website to a hosting platform
2. ✅ Get DNS records from your hosting platform
3. ✅ Configure DNS in Namecheap
4. ✅ Add domains to your hosting platform
5. ✅ Wait for DNS propagation
6. ✅ Verify SSL certificates
7. ✅ Test your website at `https://cray.eu`

Your website will be live at `https://cray.eu` and `https://www.cray.eu`! 🎉

