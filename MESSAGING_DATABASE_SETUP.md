# 🗄️ Database Setup for Messaging System

## 🚀 **Quick Setup Guide**

Follow these steps to set up the messaging database in Supabase:

### **Step 1: Access Supabase Dashboard**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Select your project
4. Go to **SQL Editor** in the left sidebar

### **Step 2: Run the Setup Script**
1. Click **"New Query"** in the SQL Editor
2. Copy and paste the contents of `supabase/setup_messaging.sql`
3. Click **"Run"** to execute the script

### **Step 3: Verify Tables Created**
Check that these tables were created:
- `profiles`
- `conversations`
- `messages`
- `message_attachments`
- `message_read_receipts`

### **Step 4: Test the Setup**
1. Go to **Authentication** → **Users**
2. Create a test user or use the demo users
3. Go to **Table Editor** to see the tables

## 📋 **What the Script Creates**

### **🗂️ Tables**

#### **1. Profiles Table**
```sql
profiles (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE,
  user_metadata JSONB,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### **2. Conversations Table**
```sql
conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  admin_id UUID REFERENCES auth.users(id),
  subject TEXT,
  status TEXT CHECK (status IN ('active', 'closed', 'archived')),
  last_message_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### **3. Messages Table**
```sql
messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES conversations(id),
  sender_id UUID REFERENCES auth.users(id),
  content TEXT,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'file', 'system')),
  status TEXT CHECK (status IN ('sent', 'delivered', 'read')),
  is_admin_message BOOLEAN,
  -- Translation fields
  original_content TEXT,
  translated_content TEXT,
  original_language TEXT,
  target_language TEXT,
  is_translated BOOLEAN,
  translation_confidence DECIMAL(3,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

#### **4. Message Attachments Table**
```sql
message_attachments (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  file_url TEXT,
  file_name TEXT,
  file_size INTEGER,
  file_type TEXT,
  created_at TIMESTAMP
)
```

#### **5. Message Read Receipts Table**
```sql
message_read_receipts (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES messages(id),
  user_id UUID REFERENCES auth.users(id),
  read_at TIMESTAMP,
  UNIQUE(message_id, user_id)
)
```

### **🔧 Functions**

#### **1. update_updated_at_column()**
- Automatically updates the `updated_at` timestamp when records are modified

#### **2. update_conversation_last_message()**
- Updates the `last_message_at` field when new messages are added

#### **3. mark_messages_as_read(conversation_uuid)**
- Marks all messages in a conversation as read for the current user

#### **4. handle_new_user()**
- Automatically creates a profile when a new user signs up

### **🔒 Security (RLS Policies)**

#### **Row Level Security (RLS) is enabled on all tables with policies:**

- **Profiles**: Users can only view/update their own profile
- **Conversations**: Users can only see conversations they're part of
- **Messages**: Users can only see messages in their conversations
- **Attachments**: Users can only see attachments in their conversations
- **Read Receipts**: Users can only see read receipts for their messages

### **📊 Indexes**

Created for optimal performance:
- `idx_conversations_user_id` - Fast user conversation lookups
- `idx_conversations_admin_id` - Fast admin conversation lookups
- `idx_conversations_status` - Fast status filtering
- `idx_messages_conversation_id` - Fast message loading
- `idx_messages_sender_id` - Fast sender lookups
- `idx_messages_created_at` - Fast chronological ordering

## 🧪 **Testing the Setup**

### **1. Create Test Users**
```sql
-- This will be done automatically when users sign up
-- Or you can create them manually in the Supabase Auth dashboard
```

### **2. Test Message Flow**
1. **Sign up** a user in your app
2. **Open the chat widget** - it should create a conversation
3. **Send a message** - it should appear in the messages table
4. **Check admin panel** - you should see the conversation

### **3. Verify Real-time Updates**
1. **Open two browser windows**
2. **Sign in as different users**
3. **Send messages** - they should appear in real-time

## 🔧 **Troubleshooting**

### **Common Issues:**

#### **1. "Permission denied" errors**
- Check that RLS policies are correctly set up
- Verify user is authenticated
- Check user has proper permissions

#### **2. "Table doesn't exist" errors**
- Run the setup script again
- Check that all tables were created
- Verify you're in the correct database

#### **3. Real-time not working**
- Check that Supabase Realtime is enabled
- Verify WebSocket connections are allowed
- Check browser console for errors

#### **4. Translation not working**
- Check that translation fields exist in messages table
- Verify translation service is running
- Check console for translation errors

### **Debug Queries:**

#### **Check if tables exist:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'conversations', 'messages', 'message_attachments', 'message_read_receipts');
```

#### **Check RLS policies:**
```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE schemaname = 'public';
```

#### **Check if user is authenticated:**
```sql
SELECT auth.uid() as current_user_id;
```

## 🚀 **Production Considerations**

### **1. Database Optimization**
- Monitor query performance
- Add additional indexes if needed
- Consider partitioning for large message volumes

### **2. Security**
- Review RLS policies regularly
- Monitor for unauthorized access
- Implement rate limiting

### **3. Backup & Recovery**
- Set up automated backups
- Test recovery procedures
- Monitor database health

### **4. Scaling**
- Consider read replicas for heavy read loads
- Implement message archiving for old conversations
- Monitor connection limits

## ✅ **Verification Checklist**

- [ ] All tables created successfully
- [ ] RLS policies enabled and working
- [ ] Functions created and working
- [ ] Indexes created for performance
- [ ] Test users can create conversations
- [ ] Messages can be sent and received
- [ ] Real-time updates working
- [ ] Translation fields available
- [ ] Admin panel can view conversations
- [ ] Read receipts working

## 🎉 **Ready to Go!**

Once you've completed the setup, your messaging system will be fully functional with:
- ✅ **Real-time messaging** between users and admins
- ✅ **Auto-translation** support
- ✅ **Secure access** with RLS
- ✅ **Performance optimized** with indexes
- ✅ **Scalable architecture** for growth

**Your messaging database is now ready!** 🚀💬
