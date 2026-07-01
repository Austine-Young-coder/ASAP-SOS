import { useCallback, useEffect, useState } from "react";
import { supabase, supabaseConfigured } from "../lib/supabaseClient";
import { getLocal, setLocal, removeLocal } from "../lib/storage";

export function useAuth() {
  const [user, setUser] = useState(() => getLocal("user"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return undefined;
    }
    supabase.auth.getSession().then(({ data }) => {
      const sessionUser = data?.session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) setLocal("user", sessionUser);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setLocal("user", session.user);
      else removeLocal("user");
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!supabaseConfigured) {
      throw new Error("Sign-in isn't configured yet. Add Supabase keys to enable this.");
    }
    return supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin }
    });
  }, []);

  const signInWithApple = useCallback(async () => {
    if (!supabaseConfigured) {
      throw new Error("Sign-in isn't configured yet. Add Supabase keys to enable this.");
    }
    return supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: window.location.origin }
    });
  }, []);

  const signOut = useCallback(async () => {
    if (supabaseConfigured) await supabase.auth.signOut();
    removeLocal("user");
    setUser(null);
  }, []);

  return { user, loading, signInWithGoogle, signInWithApple, signOut };
}
