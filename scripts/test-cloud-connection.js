#!/usr/bin/env node

/**
 * Test Supabase Cloud Connection
 * This script tests your connection to Supabase Cloud
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.join(__dirname, '..');

// Load environment variables
dotenv.config({ path: path.join(projectRoot, '.env.local') });

console.log('🔍 Testing Supabase Cloud Connection');
console.log('=====================================\n');

// Check if environment variables are set
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables!');
  console.log('Please make sure .env.local contains:');
  console.log('- VITE_SUPABASE_URL');
  console.log('- VITE_SUPABASE_ANON_KEY\n');
  process.exit(1);
}

if (supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key-here')) {
  console.log('⚠️  Please update .env.local with your actual Supabase Cloud credentials!');
  console.log('Current values appear to be placeholders.\n');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`📍 Supabase URL: ${supabaseUrl}`);
console.log(`🔑 Anon Key: ${supabaseKey.substring(0, 20)}...\n`);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('🔄 Testing database connection...');
    
    // Test basic connection
    const { data, error } = await supabase
      .from('conversations')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ Database connection failed:');
      console.log(`   Error: ${error.message}\n`);
      
      if (error.message.includes('relation "conversations" does not exist')) {
        console.log('💡 The messaging tables might not be set up yet.');
        console.log('   Please run the database setup script in your Supabase dashboard.\n');
      }
      
      return false;
    }
    
    console.log('✅ Database connection successful!');
    
    // Test authentication
    console.log('🔄 Testing authentication...');
    const { data: authData, error: authError } = await supabase.auth.getSession();
    
    if (authError) {
      console.log('⚠️  Authentication test failed:');
      console.log(`   Error: ${authError.message}\n`);
    } else {
      console.log('✅ Authentication system working!');
    }
    
    // Test messaging tables
    console.log('🔄 Testing messaging tables...');
    const { data: conversations, error: convError } = await supabase
      .from('conversations')
      .select('id')
      .limit(1);
    
    if (convError) {
      console.log('❌ Messaging tables not accessible:');
      console.log(`   Error: ${convError.message}\n`);
      return false;
    }
    
    console.log('✅ Messaging tables accessible!');
    
    // Test profiles table
    const { data: profiles, error: profError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profError) {
      console.log('❌ Profiles table not accessible:');
      console.log(`   Error: ${profError.message}\n`);
      return false;
    }
    
    console.log('✅ Profiles table accessible!');
    
    console.log('\n🎉 All tests passed! Your Supabase Cloud connection is working correctly.');
    console.log('You can now use the chat widget on your website.\n');
    
    return true;
    
  } catch (error) {
    console.log('❌ Connection test failed:');
    console.log(`   Error: ${error.message}\n`);
    return false;
  }
}

// Run the test
testConnection().then(success => {
  if (success) {
    console.log('🚀 Ready to go! Run "npm run dev" to start your development server.');
  } else {
    console.log('🔧 Please check your Supabase Cloud setup and try again.');
  }
});

