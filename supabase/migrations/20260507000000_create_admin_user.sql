-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin user: onezsteph1@gmail.com
-- Password: @@CravyPassword24.@

SET search_path = public, extensions, auth;

DO $$
DECLARE
  admin_id UUID := gen_random_uuid();
BEGIN
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at, raw_user_meta_data,
    raw_app_meta_data, is_super_admin, confirmation_token,
    email_change, email_change_token_new, recovery_token
  ) VALUES (
    admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'onezsteph1@gmail.com',
    crypt('@@CravyPassword24.@', gen_salt('bf')),
    NOW(), NOW(), NOW(),
    '{"display_name": "Admin", "is_admin": true}'::jsonb,
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    false, '', '', '', ''
  ) ON CONFLICT (id) DO NOTHING;
END $$;
