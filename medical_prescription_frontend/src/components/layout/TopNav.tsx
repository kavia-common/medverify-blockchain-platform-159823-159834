"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { WalletStatus } from "@/components/wallet/WalletContext";

// PUBLIC_INTERFACE
export function TopNav() {
  /** Top navigation with account and wallet controls. */
  const { user, logout } = useAuth();
  return (
    <header className="w-full border-b bg-white">
      <div className="container-page h-16 flex items-center justify-between">
        <Link href="/dashboard" className="text-lg font-semibold text-[var(--color-primary)]">
          MedVerify
        </Link>
        <div className="flex items-center gap-4">
          <WalletStatus />
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">
                {user.email} {user.roles?.length ? `(${user.roles?.join(", ")})` : ""}
              </span>
              <button className="btn btn-secondary px-3 py-1.5" onClick={logout}>Logout</button>
            </>
          ) : (
            <Link className="btn btn-primary px-4 py-2" href="/login">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
