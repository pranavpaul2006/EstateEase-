import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
      // Get initial session - this should persist across refreshes
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log('🔄 Initial session check:', session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('🔐 Auth state change:', event, session);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      });

      return () => subscription?.unsubscribe();
    }, []);

  // Sign in with email/password
  const signIn = async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  };

  // Sign up with email/password and optional metadata
  const signUp = async ({ email, password, fullName = "", phone = "" }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
        },
      },
    });
    console.log(data, error);
    if (error) throw error;
    return data;
  };

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signOut: () => supabase.auth.signOut(),
    signInWithGoogle: () =>
      supabase.auth.signInWithOAuth({ provider: "google" }),
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
