"use client";

import React from "react";
import { AuthProvider } from "@/components/auth/AuthContext";
import { WalletProvider } from "@/components/wallet/WalletContext";

// PUBLIC_INTERFACE
export function AppProviders({ children }: { children: React.ReactNode }) {
  /** Top-level provider wrapper for Auth and Wallet contexts. */
  return (
    <AuthProvider>
      <WalletProvider>{children}</WalletProvider>
    </AuthProvider>
  );
}
