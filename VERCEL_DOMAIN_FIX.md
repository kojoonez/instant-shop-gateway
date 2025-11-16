# 🔧 Fixing "Invalid Configuration" for www.cravy.eu in Vercel

## Quick Fix Steps

### 1. Remove the Invalid Domain
- In Vercel dashboard, click "Remove" on `www.cravy.eu` (the one showing "Invalid Configuration")

### 2. Add Root Domain First
- Click "Add Domain"
- Enter: `cravy.eu` (without www)
- Click "Add"
- Vercel will show you DNS records to add

### 3. Add www Subdomain
- Click "Add Domain" again
- Enter: `www.cravy.eu`
- Click "Add"
- Vercel will show you DNS records for www

### 4. Configure DNS in Namecheap

1. **Log in to Namecheap**
   - Go to [namecheap.com](https://www.namecheap.com)
   - Sign in

2. **Go to Domain Management**
   - Domain List → Find `cravy.eu` → Click "Manage"
   - Click "Advanced DNS" tab

3. **Remove Old Records**
   - Delete any existing A records or CNAME records

4. **Add Vercel DNS Records**
   
   Vercel will show you something like:
   
   **For root domain (cravy.eu):**
   - Type: **A Record**
   - Host: `@` (or leave blank)
   - Value: `76.76.21.21` (or similar IP from Vercel)
   - TTL: Automatic
   
   **For www (www.cravy.eu):**
   - Type: **CNAME Record**
   - Host: `www`
   - Value: `cname.vercel-dns.com` (or what Vercel shows)
   - TTL: Automatic

5. **Save and Wait**
   - Click "Save" in Namecheap
   - Wait 1-2 hours for DNS propagation
   - Vercel will automatically provision SSL certificates

### 5. Verify in Vercel
- Go back to Vercel dashboard
- Both domains should show "Valid Configuration" with green checkmarks
- SSL certificates will be provisioned automatically

## Common Issues

### Still Shows "Invalid Configuration" After Adding DNS
- **Wait longer**: DNS can take up to 48 hours (usually 1-2 hours)
- **Check DNS records**: Make sure you copied the exact values from Vercel
- **Verify in Namecheap**: Check that records are saved correctly

### Only One Domain Works
- Make sure you added BOTH `cravy.eu` and `www.cravy.eu` in Vercel
- Both need their respective DNS records in Namecheap

### SSL Certificate Not Working
- Wait 5-10 minutes after DNS propagation
- Vercel automatically provisions SSL - no action needed
- Check that domains show "Valid Configuration" in Vercel

## Check DNS Propagation

Visit [whatsmydns.net](https://www.whatsmydns.net) and check:
- `cravy.eu` - should show Vercel's A record IP
- `www.cravy.eu` - should show Vercel's CNAME record

Once DNS propagates globally, Vercel will automatically:
- ✅ Provision SSL certificates
- ✅ Set up HTTPS
- ✅ Configure redirects

Your site will be live at:
- `https://cravy.eu`
- `https://www.cravy.eu`

