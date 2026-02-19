"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types/database";

const PROFILE_CACHE_KEY = "financas_profile_cache";

function getCachedProfile(): User | null {
  try {
    const raw = localStorage.getItem(PROFILE_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed._cachedAt && Date.now() - parsed._cachedAt > 24 * 60 * 60 * 1000) {
      localStorage.removeItem(PROFILE_CACHE_KEY);
      return null;
    }
    const { _cachedAt, ...profile } = parsed;
    return profile as User;
  } catch {
    return null;
  }
}

function setCachedProfile(profile: User | null): void {
  try {
    if (profile) {
      localStorage.setItem(
        PROFILE_CACHE_KEY,
        JSON.stringify({ ...profile, _cachedAt: Date.now() })
      );
    } else {
      localStorage.removeItem(PROFILE_CACHE_KEY);
    }
  } catch {
    // Silently ignore localStorage errors
  }
}

interface AuthState {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>(() => ({
    user: null,
    profile: getCachedProfile(),
    loading: true,
    error: null,
  }));

  const supabase = useMemo(() => createClient(), []);

  const fetchProfile = useCallback(
    async (userId: string): Promise<User | null> => {
      console.log("[useAuth] fetchProfile START for:", userId);
      try {
        const TIMEOUT_MS = 5000;
        const queryPromise = supabase
          .from("users")
          .select("*")
          .eq("id", userId)
          .single();

        const result = await Promise.race([
          queryPromise,
          new Promise<{ data: null; error: { message: string } }>((resolve) =>
            setTimeout(
              () => resolve({ data: null, error: { message: "fetchProfile timeout" } }),
              TIMEOUT_MS
            )
          ),
        ]);

        const { data, error } = result;
        const profile = data as User | null;
        console.log("[useAuth] fetchProfile result:", {
          subscription_tier: profile?.subscription_tier,
          error: error?.message,
        });

        if (profile) {
          setCachedProfile(profile);
        }
        return profile;
      } catch (err) {
        console.error("[useAuth] fetchProfile EXCEPTION:", err);
        return null;
      }
    },
    [supabase]
  );

  useEffect(() => {
    let cancelled = false;
    let resolved = false;

    // 1) getSession() reads from local storage — fast, never hangs
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (cancelled || resolved) return;
      resolved = true;
      console.log("[useAuth] getSession:", !!session?.user);

      if (session?.user) {
        // Stop spinner immediately, fetch profile in background
        setState((prev) => ({
          ...prev,
          user: session.user,
          loading: false,
          error: null,
        }));
        const profile = await fetchProfile(session.user.id);
        if (!cancelled && profile) {
          setState((prev) => ({ ...prev, profile }));
        }
      } else {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });

    // 2) Listen for auth changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("[useAuth] onAuthStateChange:", event, !!session?.user);

      // If INITIAL_SESSION arrives before getSession resolves, handle it
      if (event === "INITIAL_SESSION" && !resolved) {
        resolved = true;
        if (session?.user) {
          setState((prev) => ({
            ...prev,
            user: session.user,
            loading: false,
            error: null,
          }));
          const profile = await fetchProfile(session.user.id);
          if (!cancelled && profile) {
            setState((prev) => ({ ...prev, profile }));
          }
        } else {
          setState({ user: null, profile: null, loading: false, error: null });
        }
        return;
      }

      // Skip duplicate INITIAL_SESSION if getSession already handled it
      if (event === "INITIAL_SESSION") return;

      // Handle subsequent auth changes
      if (session?.user) {
        setState((prev) => ({
          ...prev,
          user: session.user,
          loading: false,
          error: null,
        }));
        const profile = await fetchProfile(session.user.id);
        if (!cancelled && profile) {
          setState((prev) => ({ ...prev, profile }));
        }
      } else if (event === "SIGNED_OUT") {
        setCachedProfile(null);
        if (!cancelled) {
          setState({ user: null, profile: null, loading: false, error: null });
        }
      }
    });

    // 3) Safety-net: force loading=false after 5s no matter what
    const safetyTimeout = setTimeout(() => {
      if (!resolved) {
        console.warn("[useAuth] Safety timeout triggered — forcing loading=false");
        resolved = true;
        setState((prev) => (prev.loading ? { ...prev, loading: false } : prev));
      }
    }, 5000);

    return () => {
      cancelled = true;
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, [supabase, fetchProfile]);

  const signInWithEmail = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Erro ao iniciar sessão",
        }));
        throw err;
      }
    },
    [supabase]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/callback`,
          },
        });
        if (error) throw error;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Erro ao criar conta",
        }));
        throw err;
      }
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/callback`,
        },
      });
      if (error) throw error;
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error:
          err instanceof Error
            ? err.message
            : "Erro ao iniciar sessão com Google",
      }));
      throw err;
    }
  }, [supabase]);

  const signOut = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setCachedProfile(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: err instanceof Error ? err.message : "Erro ao terminar sessão",
      }));
      throw err;
    }
  }, [supabase, router]);

  const resetPassword = useCallback(
    async (email: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
      } catch (err) {
        setState((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error
              ? err.message
              : "Erro ao enviar email de recuperação",
        }));
        throw err;
      }
    },
    [supabase]
  );

  const isPro = useCallback((): boolean => {
    if (!state.profile) return false;

    // Founding members always have Pro
    if (state.profile.is_founding_member) return true;

    // Check active subscription
    if (state.profile.subscription_tier === "pro") {
      if (!state.profile.subscription_expires_at) return true;
      return new Date(state.profile.subscription_expires_at) > new Date();
    }

    // Check active trial (7 days)
    if (state.profile.trial_started_at) {
      const trialEnd = new Date(state.profile.trial_started_at);
      trialEnd.setDate(trialEnd.getDate() + 7);
      return trialEnd > new Date();
    }

    return false;
  }, [state.profile]);

  const refreshProfile = useCallback(async (): Promise<User | null> => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile }));
      return profile;
    }
    return null;
  }, [state.user, fetchProfile]);

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    error: state.error,
    isAuthenticated: !!state.user,
    isPro,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
    resetPassword,
    refreshProfile,
  };
}
