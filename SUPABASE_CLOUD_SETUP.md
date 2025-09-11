# 🚀 Supabase Cloud Setup Guide

This guide will help you connect your local project to a Supabase Cloud project.

## Step 1: Create Supabase Cloud Project

1. **Go to Supabase Cloud**
   - Visit [supabase.com](https://supabase.com)
   - Sign up or login to your account

2. **Create New Project**
   - Click "New Project"
   - Choose your organization
   - Enter project details:
     - **Name**: `cravy-messaging` (or your preferred name)
     - **Database Password**: Create a strong password (save this!)
     - **Region**: Choose the closest to your location
   - Click "Create new project"

3. **Wait for Setup**
   - The project will take 1-2 minutes to initialize
   - You'll see a progress indicator

## Step 2: Get Your Project Credentials

1. **Go to Project Settings**
   - In your Supabase dashboard, click the gear icon (Settings)
   - Go to "API" section

2. **Copy Your Credentials**
   - **Project URL**: `https://your-project-id.supabase.co`
   - **Anon (public) key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Service role key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (keep this secret!)

## Step 3: Update Your Local Environment

1. **Create Environment File**
   ```bash
   # Create .env.local file in your project root
   touch .env.local
   ```

2. **Add Your Credentials**
   ```env
   # Supabase Cloud Configuration
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```

3. **Replace Placeholders**
   - Replace `your-project-id` with your actual project ID
   - Replace `your-anon-key-here` with your actual anon key
   - Replace `your-service-role-key-here` with your actual service role key

## Step 4: Run Database Setup

1. **Connect to Your Cloud Project**
   ```bash
   # Link your local project to Supabase Cloud
   npx supabase link --project-ref your-project-id
   ```

2. **Run the Database Setup**
   ```bash
   # Run the messaging setup script
   npx supabase db push
   ```

3. **Or Use the SQL Editor**
   - Go to your Supabase dashboard
   - Click "SQL Editor"
   - Copy and paste the contents of `supabase/setup_messaging_simple.sql`
   - Click "Run"

## Step 5: Test the Connection

1. **Start Your Development Server**
   ```bash
   npm run dev
   ```

2. **Test the Chat Widget**
   - Open your website
   - Try to open the chat widget
   - Check if messages are being sent/received

## Step 6: Create Test Users

1. **Go to Authentication**
   - In your Supabase dashboard, go to "Authentication" > "Users"
   - Click "Add user" to create test users

2. **Or Use the Demo Setup**
   ```bash
   # Run the demo user setup script
   npm run setup:demo
   ```

## Troubleshooting

### Common Issues:

1. **"Invalid API key"**
   - Check that your environment variables are correct
   - Make sure you're using the right keys (anon vs service role)

2. **"Database connection failed"**
   - Verify your project URL is correct
   - Check if your project is still initializing

3. **"RLS policy violation"**
   - Make sure you've run the database setup script
   - Check that users exist in the auth.users table

### Getting Help:

- Check the Supabase documentation: [supabase.com/docs](https://supabase.com/docs)
- Join the Supabase Discord: [discord.supabase.com](https://discord.supabase.com)
- Check the project logs in your Supabase dashboard

## Next Steps

Once connected to Supabase Cloud:
1. Your messaging system will work in real-time
2. You can manage users through the Supabase dashboard
3. You can monitor usage and performance
4. You can deploy your app to production

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your service role key secret
- Use environment variables in production
- Enable RLS policies for data security

