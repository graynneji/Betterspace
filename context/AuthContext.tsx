// context/AuthContext.tsx
import { AuthAdapter } from "@/adapter/authAdapter";
import { Session, User } from "@supabase/supabase-js";
import React, { createContext, useContext, useEffect, useState } from "react";


const authAdapter = new AuthAdapter();

type AuthContextType = {
  session: Session | null;
  loading: boolean;
};

interface DataUser {
  data: {
    user: User | null
  }
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get initial session
    authAdapter.getUser().then(({ data }: DataUser) => {
      setSession(data?.user ? { user: data.user } as Session : null);
      setLoading(false);
    });

    // subscribe to changes
    const sub = authAdapter.onAuthStateChange((sess: React.SetStateAction<Session | null>) => {
      setSession(sess);
    });

    return () => {
      sub.subscription?.unsubscribe?.();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ session, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCheckAuth = () => useContext(AuthContext);
