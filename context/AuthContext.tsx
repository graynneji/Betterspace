// context/AuthContext.tsx
import { AuthAdapter } from "@/adapter/authAdapter";
import { AuthService } from "@/services/authService";
import { Client } from "@/utils/client";
import { Session } from "@supabase/supabase-js";
import * as SecureStore from 'expo-secure-store';
import React, { createContext, useContext, useEffect, useState } from "react";

const client = new Client();
const authAdapter = new AuthAdapter(client);
const authService = new AuthService(authAdapter);

type AuthContextType = {
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (email: string, password: string) => Promise<void>;
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
  login: async () => { },
  register: async () => { },
  logout: async () => { },
});



export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const callRefresh = async () => {
    await authService.refreshSession()
  }

  useEffect(() => {
    // get initial session
    //  const init = async() =>{
    //     try{
    // callRefresh()
    //   authService.checkUser().then(({ data }: DataUser) => {
    //     setSession(data?.session ?? null);
    //   });
    // }catch(err){
    //   setSession(null)
    // }finally{
    //       setLoading(false);

    //     }
    //   }
    // init()
    callRefresh()
    authService.checkUser().then(({ data }: DataUser) => {
      setSession(data?.session ?? null);
      setLoading(false);
    });

    // subscribe to changes
    const subscription = authAdapter.onAuthStateChange((session: Session | null) => {
      setSession(session);
    });

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
      const { data } = await authService.login(email, password);
      setSession(data?.session);
      return { data };
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);
    try {
      await authService.register(email, password);
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
    <AuthContext.Provider value={{ session, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCheckAuth = () => useContext(AuthContext);
