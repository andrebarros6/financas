-- Add poll/feedback tracking to waitlist
-- Stores feature votes from waitlist users

-- ===========================================
-- WAITLIST VOTES TABLE
-- ===========================================
CREATE TABLE public.waitlist_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  waitlist_id UUID NOT NULL REFERENCES public.waitlist(id) ON DELETE CASCADE,
  feature TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Each waitlist entry can only vote once per feature
  UNIQUE(waitlist_id, feature)
);

-- Index for analytics queries
CREATE INDEX idx_waitlist_votes_feature ON public.waitlist_votes(feature);
CREATE INDEX idx_waitlist_votes_waitlist_id ON public.waitlist_votes(waitlist_id);

-- ===========================================
-- ROW LEVEL SECURITY
-- ===========================================
ALTER TABLE public.waitlist_votes ENABLE ROW LEVEL SECURITY;

-- Anyone can insert votes (public poll)
CREATE POLICY "Anyone can vote" ON public.waitlist_votes
  FOR INSERT WITH CHECK (true);

-- Service role can read votes for analytics
-- Note: Service role bypasses RLS by default
