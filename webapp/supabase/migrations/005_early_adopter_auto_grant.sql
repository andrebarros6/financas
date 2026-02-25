-- Migration 005: Auto-grant 1 year of Pro to the first 10 users who sign up
--
-- Replaces handle_new_user() to check the current user count before insert.
-- If fewer than 10 users already exist, the new user gets:
--   subscription_tier = 'pro'
--   subscription_expires_at = NOW() + 1 year
--
-- The count is taken BEFORE the new row is inserted (AFTER INSERT trigger,
-- so we count existing rows excluding the one just created by checking < 10).

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  existing_count INTEGER;
  early_adopter_limit CONSTANT INTEGER := 10;
BEGIN
  SELECT COUNT(*) INTO existing_count FROM public.users;

  IF existing_count < early_adopter_limit THEN
    -- This user is one of the first 10 — grant 1 year of Pro
    INSERT INTO public.users (id, email, subscription_tier, subscription_expires_at)
    VALUES (
      NEW.id,
      NEW.email,
      'pro',
      NOW() + INTERVAL '1 year'
    );
  ELSE
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
