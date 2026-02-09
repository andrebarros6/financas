-- Insert missing user profile
-- Replace the UUID and email with your actual user ID and email

INSERT INTO public.users (id, email, created_at, subscription_tier)
VALUES (
  'd1a685a9-6a25-4973-8d7d-0a171e578635',
  'your-email@example.com',  -- Replace with your actual email
  NOW(),
  'free'
)
ON CONFLICT (id) DO NOTHING;
