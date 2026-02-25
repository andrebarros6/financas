-- Migration 004: Referral System
-- Adds referral_code to users, creates referrals table, RLS policies,
-- and a SECURITY DEFINER function to grant rewards atomically.

-- ===========================================
-- 1. Add referral_code to users table
-- ===========================================
ALTER TABLE public.users
  ADD COLUMN referral_code TEXT UNIQUE;

CREATE INDEX idx_users_referral_code ON public.users(referral_code);

-- ===========================================
-- 2. Referrals table
-- ===========================================
CREATE TABLE public.referrals (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id  UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  code_used   TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'rewarded', 'invalid')),
  rewarded_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),

  -- One referee can only ever claim one referral
  UNIQUE (referee_id)
);

CREATE INDEX idx_referrals_referrer_id ON public.referrals(referrer_id);

-- ===========================================
-- 3. Row Level Security
-- ===========================================
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Referrers can view their own referrals (for stats display on settings page)
CREATE POLICY "Referrers can view own referrals"
  ON public.referrals
  FOR SELECT
  USING (auth.uid() = referrer_id);

-- All writes are handled via service role in API routes — no client INSERT policy needed.

-- ===========================================
-- 4. grant_referral_reward function
-- ===========================================
-- Called exclusively from server-side API routes using the service role.
-- Uses FOR UPDATE to prevent double-reward race conditions.
-- Extends referrer's Pro subscription by 30 days (or grants 30 days from now).
CREATE OR REPLACE FUNCTION public.grant_referral_reward(p_referral_id UUID)
RETURNS VOID AS $$
DECLARE
  v_referrer_id UUID;
  v_current_tier TEXT;
  v_expires_at   TIMESTAMPTZ;
  v_new_expires  TIMESTAMPTZ;
BEGIN
  -- Lock the referral row to prevent concurrent double-rewards
  SELECT referrer_id
  INTO   v_referrer_id
  FROM   public.referrals
  WHERE  id = p_referral_id AND status = 'pending'
  FOR UPDATE;

  -- Idempotent: if already rewarded or not found, exit silently
  IF NOT FOUND THEN
    RETURN;
  END IF;

  -- Read referrer's current subscription state
  SELECT subscription_tier, subscription_expires_at
  INTO   v_current_tier, v_expires_at
  FROM   public.users
  WHERE  id = v_referrer_id;

  -- Extend from existing expiry if Pro and not yet expired, else grant from now
  IF v_current_tier = 'pro'
     AND v_expires_at IS NOT NULL
     AND v_expires_at > NOW() THEN
    v_new_expires := v_expires_at + INTERVAL '30 days';
  ELSE
    v_new_expires := NOW() + INTERVAL '30 days';
  END IF;

  -- Grant / extend Pro
  UPDATE public.users
  SET
    subscription_tier       = 'pro',
    subscription_expires_at = v_new_expires
  WHERE id = v_referrer_id;

  -- Mark referral as rewarded
  UPDATE public.referrals
  SET
    status      = 'rewarded',
    rewarded_at = NOW()
  WHERE id = p_referral_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
