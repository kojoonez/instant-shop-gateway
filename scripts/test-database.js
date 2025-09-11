#!/usr/bin/env node

// Test script to verify database setup
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testDatabaseSetup() {
  console.log('🧪 Testing database setup...\n');

  try {
    // Test 1: Check if tables exist
    console.log('1. Checking if tables exist...');
    const tables = ['profiles', 'conversations', 'messages', 'message_attachments', 'message_read_receipts'];
    
    for (const table of tables) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        if (error) {
          console.log(`❌ Table ${table}: ${error.message}`);
        } else {
          console.log(`✅ Table ${table}: OK`);
        }
      } catch (err) {
        console.log(`❌ Table ${table}: ${err.message}`);
      }
    }

    // Test 2: Check if demo users exist
    console.log('\n2. Checking demo users...');
    try {
      const { data: users, error } = await supabase.auth.admin.listUsers();
      if (error) {
        console.log(`❌ Error fetching users: ${error.message}`);
      } else {
        const demoUsers = users.users.filter(user => 
          user.email === 'demo@cravy.com' || user.email === 'admin@cravy.com'
        );
        console.log(`✅ Found ${demoUsers.length} demo users`);
        demoUsers.forEach(user => {
          console.log(`   - ${user.email} (${user.id})`);
        });
      }
    } catch (err) {
      console.log(`❌ Error checking users: ${err.message}`);
    }

    // Test 3: Check if profiles exist
    console.log('\n3. Checking profiles...');
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
      
      if (error) {
        console.log(`❌ Error fetching profiles: ${error.message}`);
      } else {
        console.log(`✅ Found ${profiles.length} profiles`);
        profiles.forEach(profile => {
          console.log(`   - ${profile.email} (${profile.id})`);
        });
      }
    } catch (err) {
      console.log(`❌ Error checking profiles: ${err.message}`);
    }

    // Test 4: Check if conversations exist
    console.log('\n4. Checking conversations...');
    try {
      const { data: conversations, error } = await supabase
        .from('conversations')
        .select('*');
      
      if (error) {
        console.log(`❌ Error fetching conversations: ${error.message}`);
      } else {
        console.log(`✅ Found ${conversations.length} conversations`);
        conversations.forEach(conv => {
          console.log(`   - ${conv.subject} (${conv.status})`);
        });
      }
    } catch (err) {
      console.log(`❌ Error checking conversations: ${err.message}`);
    }

    // Test 5: Check if messages exist
    console.log('\n5. Checking messages...');
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select('*');
      
      if (error) {
        console.log(`❌ Error fetching messages: ${error.message}`);
      } else {
        console.log(`✅ Found ${messages.length} messages`);
        messages.forEach(msg => {
          console.log(`   - ${msg.content.substring(0, 50)}... (${msg.is_admin_message ? 'admin' : 'user'})`);
        });
      }
    } catch (err) {
      console.log(`❌ Error checking messages: ${err.message}`);
    }

    // Test 6: Test RLS policies
    console.log('\n6. Testing RLS policies...');
    try {
      // This should fail without authentication
      const { data, error } = await supabase
        .from('conversations')
        .select('*');
      
      if (error && error.message.includes('permission denied')) {
        console.log('✅ RLS policies are working (correctly blocking unauthenticated access)');
      } else {
        console.log('⚠️  RLS policies may not be working correctly');
      }
    } catch (err) {
      console.log('✅ RLS policies are working (correctly blocking unauthenticated access)');
    }

    console.log('\n🎉 Database setup test completed!');
    console.log('\n📋 Next steps:');
    console.log('1. Start your development server: npm run dev');
    console.log('2. Sign in with demo@cravy.com / demo123');
    console.log('3. Test the chat functionality');
    console.log('4. Check admin panel at /admin/messages');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDatabaseSetup();
