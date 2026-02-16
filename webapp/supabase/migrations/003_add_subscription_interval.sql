-- Add subscription interval column to track monthly vs annual billing
ALTER TABLE public.users
  ADD COLUMN subscription_interval TEXT DEFAULT NULL
  CHECK (subscription_interval IN ('monthly', 'annual'));

-- Add Stripe subscription ID for direct lookup
ALTER TABLE public.users
  ADD COLUMN stripe_subscription_id TEXT UNIQUE;

CREATE INDEX idx_users_stripe_subscription_id ON public.users(stripe_subscription_id);
