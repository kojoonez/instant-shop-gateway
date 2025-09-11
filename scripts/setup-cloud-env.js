#!/usr/bin/env node

/**
 * Supabase Cloud Environment Setup Script
 * This script helps you set up your environment variables for Supabase Cloud
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

console.log('🚀 Supabase Cloud Environment Setup');
console.log('=====================================\n');

// Check if .env.local already exists
const envPath = path.join(projectRoot, '.env.local');
if (fs.existsSync(envPath)) {
  console.log('⚠️  .env.local already exists!');
  console.log('Please backup your existing file and try again.\n');
  process.exit(1);
}

// Create .env.local template
const envTemplate = `# Supabase Cloud Configuration
# Replace these with your actual Supabase Cloud project credentials

# Your Supabase Cloud Project URL
VITE_SUPABASE_URL=https://your-project-id.supabase.co

# Your Supabase Cloud Anon Key (public key)
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Your Supabase Cloud Service Role Key (keep this secret!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
`;

try {
  fs.writeFileSync(envPath, envTemplate);
  console.log('✅ Created .env.local file');
  console.log('📝 Please edit .env.local with your actual Supabase Cloud credentials\n');
  
  console.log('Next steps:');
  console.log('1. Go to your Supabase Cloud dashboard');
  console.log('2. Copy your Project URL and API keys');
  console.log('3. Update .env.local with your actual credentials');
  console.log('4. Run: npm run dev');
  console.log('5. Test the chat widget!\n');
  
} catch (error) {
  console.error('❌ Error creating .env.local:', error.message);
  process.exit(1);
}

