"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { apiLogin, apiMe, apiRegister, Role, TokenResponse, UserPublic } from "@/lib/api";
import { clearToken, getToken, saveToken } from "@/lib/storage";

type AuthContextState = {
  user: UserPublic | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  roles: Role[];
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { email: string; password: string; role: Role; username?: string; full_name?: string }) => Promise<void>;
  logout: () => void;
  hasRole: (role: Role | Role[]) => boolean;
};

const AuthContext = createContext<AuthContextState | undefined>(undefined);

// PUBLIC_INTERFACE
export function AuthProvider({ children }: { children: React.ReactNode }) {
  /** Provides authentication state and actions across the application. */
  const [user, setUser] = useState<UserPublic | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // initialize from storage
  useEffect(() => {
    const stored = getToken();
    if (stored) {
      setToken(stored);
      apiMe(stored)
        .then((u) => setUser(u))
        .catch(() => {
          clearToken();
          setToken(null);
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const res: TokenResponse = await apiLogin(email, password);
    saveToken(res.access_token);
    setToken(res.access_token);
    const me = await apiMe(res.access_token);
    setUser(me);
  };

  const register = async (payload: { email: string; password: string; role: Role; username?: string; full_name?: string }) => {
    await apiRegister(payload);
    // after register, auto-login
    await login(payload.email, payload.password);
  };

  const logout = () => {
    clearToken();
    setToken(null);
    setUser(null);
  };

  const roles = useMemo<Role[]>(() => user?.roles ?? [], [user]);
  const isAuthenticated = !!token && !!user;

  const hasRole = (role: Role | Role[]) => {
    const arr = Array.isArray(role) ? role : [role];
    return arr.some((r) => roles.includes(r));
  };

  const value: AuthContextState = {
    user,
    token,
    loading,
    isAuthenticated,
    roles,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// PUBLIC_INTERFACE
export function useAuth(): AuthContextState {
  /** Access the AuthContext state and actions. */
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider />");
  return ctx;
}
