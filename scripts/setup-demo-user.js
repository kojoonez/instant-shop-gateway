#!/usr/bin/env node

// Script to set up demo user for testing the chat functionality
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'http://127.0.0.1:54321';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function setupDemoUser() {
  console.log('🔧 Setting up demo user...');

  try {
    // Create demo user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'demo@cravy.com',
      password: 'demo123',
      email_confirm: true,
      user_metadata: {
        display_name: 'Demo User'
      }
    });

    if (authError) {
      console.error('❌ Error creating demo user:', authError);
      return;
    }

    console.log('✅ Demo user created successfully:', authData.user?.email);

    // Create profile for demo user
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email: 'demo@cravy.com',
        user_metadata: {
          display_name: 'Demo User'
        }
      });

    if (profileError) {
      console.log('⚠️  Profile creation error (might already exist):', profileError.message);
    } else {
      console.log('✅ Demo user profile created');
    }

    // Create admin user for testing
    const { data: adminData, error: adminError } = await supabase.auth.admin.createUser({
      email: 'admin@cravy.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        display_name: 'Support Team',
        is_admin: true
      }
    });

    if (adminError) {
      console.log('⚠️  Admin user creation error (might already exist):', adminError.message);
    } else {
      console.log('✅ Admin user created:', adminData.user?.email);

      // Create admin profile
      const { error: adminProfileError } = await supabase
        .from('profiles')
        .insert({
          id: adminData.user.id,
          email: 'admin@cravy.com',
          user_metadata: {
            display_name: 'Support Team',
            is_admin: true
          }
        });

      if (adminProfileError) {
        console.log('⚠️  Admin profile creation error (might already exist):', adminProfileError.message);
      } else {
        console.log('✅ Admin profile created');
      }
    }

    console.log('\n🎉 Demo setup complete!');
    console.log('📧 Demo User: demo@cravy.com / demo123');
    console.log('👨‍💼 Admin User: admin@cravy.com / admin123');
    console.log('\n💡 You can now test the chat functionality!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupDemoUser();
