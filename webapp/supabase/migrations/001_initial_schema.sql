-- Initial schema for Financas Dashboard
-- Users table, Receipts table, and RLS policies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===========================================
-- USERS TABLE (extends Supabase auth.users)
-- ===========================================
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_expires_at TIMESTAMPTZ,
  trial_started_at TIMESTAMPTZ,
  stripe_customer_id TEXT UNIQUE,
  is_founding_member BOOLEAN DEFAULT FALSE
);

-- Index for subscription queries
CREATE INDEX idx_users_subscription_tier ON public.users(subscription_tier);
CREATE INDEX idx_users_trial_started_at ON public.users(trial_started_at);

-- ===========================================
-- RECEIPTS TABLE (all 20 SIRE CSV columns)
-- ===========================================
CREATE TABLE public.receipts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,

  -- Document identification
  referencia TEXT NOT NULL,
  tipo_documento TEXT NOT NULL,
  atcud TEXT NOT NULL,
  situacao TEXT NOT NULL,

  -- Dates
  data_transacao DATE NOT NULL,
  motivo_emissao TEXT,
  data_emissao DATE NOT NULL,

  -- Client info
  pais_adquirente TEXT,
  nif_adquirente TEXT NOT NULL,
  nome_adquirente TEXT NOT NULL,

  -- Financial values (all in euros, stored as numeric for precision)
  valor_tributavel DECIMAL(12,2) NOT NULL,
  valor_iva DECIMAL(12,2) DEFAULT 0,
  imposto_selo_retencao DECIMAL(12,2),
  valor_imposto_selo DECIMAL(12,2) DEFAULT 0,
  valor_irs DECIMAL(12,2) DEFAULT 0,
  total_impostos DECIMAL(12,2),
  total_com_impostos DECIMAL(12,2) NOT NULL,
  total_retencoes DECIMAL(12,2) DEFAULT 0,
  contribuicao_cultura DECIMAL(12,2) DEFAULT 0,
  total_documento DECIMAL(12,2) NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint on ATCUD per user (prevent duplicates)
  UNIQUE(user_id, atcud)
);

-- Indexes for common queries
CREATE INDEX idx_receipts_user_id ON public.receipts(user_id);
CREATE INDEX idx_receipts_data_emissao ON public.receipts(data_emissao);
CREATE INDEX idx_receipts_nif_adquirente ON public.receipts(nif_adquirente);
CREATE INDEX idx_receipts_situacao ON public.receipts(situacao);
CREATE INDEX idx_receipts_nome_adquirente ON public.receipts(nome_adquirente);

-- ===========================================
-- WAITLIST TABLE (pre-launch signups)
-- ===========================================
CREATE TABLE public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  notified_at TIMESTAMPTZ  -- NULL until launch email sent
);

-- Index for email lookups
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_notified_at ON public.waitlist(notified_at);

-- ===========================================
-- UPDATED_AT TRIGGER
-- ===========================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER receipts_updated_at
  BEFORE UPDATE ON public.receipts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Receipts policies
CREATE POLICY "Users can view own receipts" ON public.receipts
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own receipts" ON public.receipts
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own receipts" ON public.receipts
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own receipts" ON public.receipts
  FOR DELETE USING (auth.uid() = user_id);

-- Waitlist policies (public insert, no read access for users)
CREATE POLICY "Anyone can join waitlist" ON public.waitlist
  FOR INSERT WITH CHECK (true);

-- Service role can read waitlist (for sending emails)
-- Note: Service role bypasses RLS by default

-- ===========================================
-- AUTO-CREATE USER PROFILE ON SIGNUP
-- ===========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for auto-creating user profile
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- HELPER FUNCTIONS
-- ===========================================

-- Function to check if user is on Pro tier (active subscription or trial)
CREATE OR REPLACE FUNCTION public.is_pro_user(user_uuid UUID)
RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
BEGIN
  SELECT subscription_tier, subscription_expires_at, trial_started_at, is_founding_member
  INTO user_record
  FROM public.users
  WHERE id = user_uuid;

  -- Founding members always have Pro
  IF user_record.is_founding_member THEN
    RETURN TRUE;
  END IF;

  -- Check active subscription
  IF user_record.subscription_tier = 'pro' AND
     (user_record.subscription_expires_at IS NULL OR user_record.subscription_expires_at > NOW()) THEN
    RETURN TRUE;
  END IF;

  -- Check active trial (7 days)
  IF user_record.trial_started_at IS NOT NULL AND
     user_record.trial_started_at + INTERVAL '7 days' > NOW() THEN
    RETURN TRUE;
  END IF;

  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's receipt years (for free tier limit check)
CREATE OR REPLACE FUNCTION public.get_user_receipt_years(user_uuid UUID)
RETURNS INTEGER[] AS $$
  SELECT ARRAY_AGG(DISTINCT EXTRACT(YEAR FROM data_emissao)::INTEGER)
  FROM public.receipts
  WHERE user_id = user_uuid AND situacao != 'Anulado';
$$ LANGUAGE sql SECURITY DEFINER;
