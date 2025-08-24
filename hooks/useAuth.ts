// src/hooks/useAuth.ts
import { AuthAdapter } from "@/adapter/authAdapter";
import { useState } from "react";
import { AuthService } from "../services/authService";

const authService = new AuthService(new AuthAdapter());

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data } = await authService.login(email, password);
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
    } finally {
      setLoading(false);
    }
  };

  return { login, register, logout, loading };
};
