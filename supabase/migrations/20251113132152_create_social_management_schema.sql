/*
  # Social Media Management Platform Schema

  ## Overview
  This migration creates the complete database schema for a social media management platform
  with AI-powered message handling capabilities.

  ## New Tables

  ### 1. profiles
  User profile information linked to auth.users
  - `id` (uuid, primary key) - References auth.users
  - `email` (text) - User email
  - `full_name` (text) - User's full name
  - `avatar_url` (text) - Profile picture URL
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. social_accounts
  Connected social media accounts for each user
  - `id` (uuid, primary key) - Account identifier
  - `user_id` (uuid) - References profiles(id)
  - `platform` (text) - Platform name (twitter, facebook, instagram, linkedin, etc.)
  - `platform_user_id` (text) - Platform-specific user ID
  - `platform_username` (text) - Username on the platform
  - `access_token` (text) - Encrypted access token
  - `refresh_token` (text) - Encrypted refresh token
  - `token_expires_at` (timestamptz) - Token expiration
  - `profile_image_url` (text) - Profile image from platform
  - `is_active` (boolean) - Account connection status
  - `last_synced_at` (timestamptz) - Last message sync timestamp
  - `created_at` (timestamptz) - Connection timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. messages
  All messages from connected social accounts
  - `id` (uuid, primary key) - Message identifier
  - `social_account_id` (uuid) - References social_accounts(id)
  - `platform_message_id` (text) - Platform-specific message ID
  - `sender_id` (text) - Sender's platform ID
  - `sender_name` (text) - Sender's display name
  - `sender_username` (text) - Sender's username
  - `sender_avatar_url` (text) - Sender's profile picture
  - `content` (text) - Message content
  - `message_type` (text) - Type: dm, comment, mention, reply
  - `parent_message_id` (uuid) - For threading/replies
  - `is_read` (boolean) - Read status
  - `is_replied` (boolean) - Reply status
  - `replied_at` (timestamptz) - Reply timestamp
  - `replied_by_ai` (boolean) - Whether AI replied
  - `sentiment` (text) - positive, neutral, negative
  - `priority` (text) - high, medium, low
  - `platform_created_at` (timestamptz) - Original message timestamp
  - `created_at` (timestamptz) - Import timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. message_replies
  Replies sent to messages (manual or AI)
  - `id` (uuid, primary key) - Reply identifier
  - `message_id` (uuid) - References messages(id)
  - `social_account_id` (uuid) - References social_accounts(id)
  - `content` (text) - Reply content
  - `sent_by_ai` (boolean) - Whether sent by AI
  - `sent_by_user_id` (uuid) - If manual, references profiles(id)
  - `platform_reply_id` (text) - Platform-specific reply ID
  - `status` (text) - pending, sent, failed
  - `error_message` (text) - Error details if failed
  - `sent_at` (timestamptz) - Send timestamp
  - `created_at` (timestamptz) - Creation timestamp

  ### 5. ai_configurations
  AI agent settings per user or per social account
  - `id` (uuid, primary key) - Configuration identifier
  - `user_id` (uuid) - References profiles(id)
  - `social_account_id` (uuid) - Optional, for account-specific settings
  - `is_enabled` (boolean) - AI agent enabled/disabled
  - `auto_reply_enabled` (boolean) - Automatic replies enabled
  - `response_tone` (text) - professional, friendly, casual, custom
  - `custom_instructions` (text) - Custom AI behavior instructions
  - `reply_delay_seconds` (integer) - Delay before auto-reply
  - `filter_keywords` (jsonb) - Keywords to trigger/skip AI
  - `business_context` (text) - Business information for AI
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 6. analytics
  Daily analytics per social account
  - `id` (uuid, primary key) - Analytics identifier
  - `social_account_id` (uuid) - References social_accounts(id)
  - `date` (date) - Analytics date
  - `messages_received` (integer) - Total messages received
  - `messages_replied` (integer) - Total replies sent
  - `ai_replies` (integer) - AI-generated replies
  - `manual_replies` (integer) - Manual replies
  - `avg_response_time_minutes` (integer) - Average response time
  - `positive_sentiment_count` (integer) - Positive messages
  - `negative_sentiment_count` (integer) - Negative messages
  - `neutral_sentiment_count` (integer) - Neutral messages
  - `created_at` (timestamptz) - Creation timestamp

  ## Security
  - Row Level Security (RLS) enabled on all tables
  - Users can only access their own data
  - Policies enforce ownership through user_id or social_account relationship
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create social_accounts table
CREATE TABLE IF NOT EXISTS social_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  platform text NOT NULL,
  platform_user_id text NOT NULL,
  platform_username text NOT NULL,
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  profile_image_url text,
  is_active boolean DEFAULT true,
  last_synced_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform, platform_user_id)
);

ALTER TABLE social_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own social accounts"
  ON social_accounts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social accounts"
  ON social_accounts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social accounts"
  ON social_accounts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own social accounts"
  ON social_accounts FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  platform_message_id text NOT NULL,
  sender_id text NOT NULL,
  sender_name text NOT NULL,
  sender_username text,
  sender_avatar_url text,
  content text NOT NULL,
  message_type text NOT NULL DEFAULT 'dm',
  parent_message_id uuid REFERENCES messages(id) ON DELETE SET NULL,
  is_read boolean DEFAULT false,
  is_replied boolean DEFAULT false,
  replied_at timestamptz,
  replied_by_ai boolean DEFAULT false,
  sentiment text DEFAULT 'neutral',
  priority text DEFAULT 'medium',
  platform_created_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(social_account_id, platform_message_id)
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages from own social accounts"
  ON messages FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = messages.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert messages to own social accounts"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = messages.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update messages from own social accounts"
  ON messages FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = messages.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = messages.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete messages from own social accounts"
  ON messages FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = messages.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

-- Create message_replies table
CREATE TABLE IF NOT EXISTS message_replies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id uuid NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  content text NOT NULL,
  sent_by_ai boolean DEFAULT false,
  sent_by_user_id uuid REFERENCES profiles(id) ON DELETE SET NULL,
  platform_reply_id text,
  status text DEFAULT 'pending',
  error_message text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE message_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view replies from own social accounts"
  ON message_replies FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = message_replies.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert replies to own social accounts"
  ON message_replies FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = message_replies.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update replies from own social accounts"
  ON message_replies FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = message_replies.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = message_replies.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

-- Create ai_configurations table
CREATE TABLE IF NOT EXISTS ai_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  social_account_id uuid REFERENCES social_accounts(id) ON DELETE CASCADE,
  is_enabled boolean DEFAULT true,
  auto_reply_enabled boolean DEFAULT false,
  response_tone text DEFAULT 'professional',
  custom_instructions text,
  reply_delay_seconds integer DEFAULT 0,
  filter_keywords jsonb DEFAULT '{"include": [], "exclude": []}'::jsonb,
  business_context text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, social_account_id)
);

ALTER TABLE ai_configurations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI configurations"
  ON ai_configurations FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI configurations"
  ON ai_configurations FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI configurations"
  ON ai_configurations FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI configurations"
  ON ai_configurations FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create analytics table
CREATE TABLE IF NOT EXISTS analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  social_account_id uuid NOT NULL REFERENCES social_accounts(id) ON DELETE CASCADE,
  date date NOT NULL,
  messages_received integer DEFAULT 0,
  messages_replied integer DEFAULT 0,
  ai_replies integer DEFAULT 0,
  manual_replies integer DEFAULT 0,
  avg_response_time_minutes integer DEFAULT 0,
  positive_sentiment_count integer DEFAULT 0,
  negative_sentiment_count integer DEFAULT 0,
  neutral_sentiment_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(social_account_id, date)
);

ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view analytics from own social accounts"
  ON analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = analytics.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert analytics for own social accounts"
  ON analytics FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM social_accounts
      WHERE social_accounts.id = analytics.social_account_id
      AND social_accounts.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_social_accounts_user_id ON social_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_social_account_id ON messages(social_account_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_is_replied ON messages(is_replied);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_message_replies_message_id ON message_replies(message_id);
CREATE INDEX IF NOT EXISTS idx_analytics_social_account_date ON analytics(social_account_id, date DESC);
