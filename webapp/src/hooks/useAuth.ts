"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/types/database";

interface AuthState {
  user: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
    error: null,
  });

  const supabase = createClient();

  const fetchProfile = useCallback(
    async (userId: string): Promise<User | null> => {
      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();
      return data as User | null;
    },
    [supabase]
  );

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
          const profile = await fetchProfile(user.id);
          setState({ user, profile, loading: false, error: null });
        } else {
          setState({ user: null, profile: null, loading: false, error: null });
        }
      } catch (err) {
        setState({
          user: null,
          profile: null,
          loading: false,
          error: err instanceof Error ? err.message : "Erro ao carregar sessão",
        });
      }
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        const profile = await fetchProfile(session.user.id);
        setState({
          user: session.user,
          profile,
          loading: false,
          error: null,
        });
      } else if (event === "SIGNED_OUT") {
        setState({ user: null, profile: null, loading: false, error: null });
      }
    });

    return () => subscription.unsubscribe();
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

  const refreshProfile = useCallback(async () => {
    if (state.user) {
      const profile = await fetchProfile(state.user.id);
      setState((prev) => ({ ...prev, profile }));
    }
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
