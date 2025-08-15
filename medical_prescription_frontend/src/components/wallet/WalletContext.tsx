"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type WalletAdapter = {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey?: { toString(): string } | string | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signMessage?: (msg: Uint8Array) => Promise<Uint8Array>;
};

type WalletCtx = {
  connected: boolean;
  address: string | null;
  connecting: boolean;
  provider: WalletAdapter | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signText: (text: string) => Promise<string | null>;
};

type WindowWithWallets = Window & {
  solana?: WalletAdapter & { isPhantom?: boolean };
  solflare?: (WalletAdapter & { isSolflare?: boolean }) | undefined;
};

const WalletContext = createContext<WalletCtx | undefined>(undefined);

// PUBLIC_INTERFACE
export function WalletProvider({ children }: { children: React.ReactNode }) {
  /** Provides Solana wallet connectivity (Phantom/Solflare) for signing actions. */
  const [provider, setProvider] = useState<WalletAdapter | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);

  // detect provider on mount
  useEffect(() => {
    const w = window as unknown as WindowWithWallets;
    const phantom = w?.solana;
    const solflare = w?.solflare && w.solflare.isSolflare ? w.solflare : null;
    const preferred = phantom?.isPhantom ? phantom : solflare ?? null;
    if (preferred) {
      setProvider(preferred);
      const pk = preferred.publicKey;
      if (pk) {
        setAddress(typeof pk === "string" ? pk : pk.toString());
        setConnected(true);
      }
    }
  }, []);

  const connect = useCallback(async () => {
    if (!provider) throw new Error("No wallet detected. Install Phantom or Solflare.");
    setConnecting(true);
    try {
      await provider.connect();
      const pk = provider.publicKey;
      setAddress(typeof pk === "string" ? pk : pk?.toString() ?? null);
      setConnected(true);
    } finally {
      setConnecting(false);
    }
  }, [provider]);

  const disconnect = useCallback(async () => {
    if (!provider) return;
    try {
      await provider.disconnect();
    } catch {
      // ignore
    }
    setConnected(false);
    setAddress(null);
  }, [provider]);

  const signText = useCallback(async (text: string): Promise<string | null> => {
    if (!provider?.signMessage) return null;
    const enc = new TextEncoder();
    const sig = await provider.signMessage(enc.encode(text));
    const b64 =
      typeof window !== "undefined"
        ? window.btoa(String.fromCharCode(...Array.from(sig)))
        : null;
    return b64;
  }, [provider]);

  const value: WalletCtx = useMemo(
    () => ({ provider, connected, connecting, address, connect, disconnect, signText }),
    [provider, connected, connecting, address, connect, disconnect, signText]
  );

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

// PUBLIC_INTERFACE
export function useWallet(): WalletCtx {
  /** Access wallet state and actions. */
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error("useWallet must be used within <WalletProvider />");
  return ctx;
}

// PUBLIC_INTERFACE
export function WalletStatus() {
  /** Small UI component showing wallet connection state and actions. */
  const { connected, address, connect, disconnect, connecting } = useWallet();
  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <>
          <span className="text-sm text-gray-700">Connected: {address?.slice(0, 4)}...{address?.slice(-4)}</span>
          <button className="btn btn-secondary px-3 py-1.5" onClick={disconnect}>Disconnect</button>
        </>
      ) : (
        <button className="btn btn-accent px-4 py-2" onClick={connect} disabled={connecting}>
          {connecting ? "Connecting..." : "Connect Wallet"}
        </button>
      )}
    </div>
  );
}
