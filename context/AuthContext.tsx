// context/AuthContext.tsx
import { AuthAdapter } from "@/adapter/authAdapter";
import { AuthService } from "@/services/authService";
import { Client } from "@/utils/client";
import { Session } from "@supabase/supabase-js";
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const client = new Client();
const authAdapter = new AuthAdapter(client);
const authService = new AuthService(authAdapter);

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: <T>(fullName: string, email: string, password: string, others: Partial<T>) => Promise<{ data: { user: any | null; session: Session | null; } | { user: null; session: null; }; error: any | null; }>;
  logout: () => Promise<void>;
};

interface DataUser {
  data: {
    session: Session | null
  }
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  login: async () => Promise.resolve({}),
  register: async () => Promise.resolve({
    data: { user: null, session: null },
    error: null
  }),
  logout: async () => Promise.resolve(),
});



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const callRefresh = async () => {
    const { success } = await authService.refreshSession()
    if (!success) return
  }

  useEffect(() => {
    // get initial session
    const init = async () => {
      try {
        callRefresh()
        // await authService.checkUser().then(({ data }: DataUser) => {
        //   setSession(data?.session ?? null);
        // });
        const { data } = await authService
          .checkUser()
          .catch(() => ({ data: { session: null } }));

        setSession(data?.session ?? null);
      } catch (err) {
        setSession(null)
      } finally {
        setLoading(false);
      }
    }
    init()
    // callRefresh()
    // authService.checkUser().then(({ data }: DataUser) => {
    //   setSession(data?.session ?? null);
    //   setLoading(false);
    // });

    // subscribe to changes
    const subscription = authService.onAuthChange((session: Session | null) => {
      setSession(session);
    });
    // const subscription = authAdapter.onAuthStateChange((session: Session | null) => {
    //   setSession(session);
    // });

    return () => {
      subscription?.unsubscribe?.();
    };
  }, []);

  // 👇 runs whenever session changes
  useEffect(() => { }, [session]);

  const login = async (email: string, password: string) => {
    await SecureStore.setItemAsync('email', email);
    await SecureStore.setItemAsync('password', password);
    setLoading(true);
    try {
      const loginResult = await authService.login(email, password);
      const data = loginResult?.data ?? { session: null };
      setSession(data?.session);
      return { data };
    } finally {
      setLoading(false);
    }
  };

  async function register<T>(fullName: string, email: string, password: string, others: Partial<T>) {
    setLoading(true);
    try {
      const result = await authService.register(email, password, others);
      const data = result?.data ?? { user: null, session: null };
      const error = result?.error ?? null;
      return { data, error }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await authService.logout();
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={useMemo(() => ({ session, loading, login, register, logout }), [session, loading])}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCheckAuth = () => useContext(AuthContext);
