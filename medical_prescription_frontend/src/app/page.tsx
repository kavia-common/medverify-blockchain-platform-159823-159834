"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";
import { WalletStatus } from "@/components/wallet/WalletContext";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <main className="min-h-screen bg-white">
      <div className="container-page py-24">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <span className="inline-block px-3 py-1 rounded-full text-white text-xs font-semibold bg-[var(--color-secondary)]">
              MedVerify
            </span>
            <h1 className="mt-4 text-4xl sm:text-5xl font-bold text-[var(--color-primary)]">
              Secure Medical Prescriptions, Verified on Solana
            </h1>
            <p className="mt-4 text-gray-600 text-lg">
              Doctors can issue prescriptions, pharmacists can verify them, and patients can view them—all backed by cryptographic signatures.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <Link
                href={isAuthenticated ? "/dashboard" : "/login"}
                className="btn btn-primary px-5 py-2"
              >
                {isAuthenticated ? "Go to Dashboard" : "Login"}
              </Link>
              <Link href="/register" className="btn btn-secondary px-5 py-2">
                Register
              </Link>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Roles: doctor, pharmacist, patient, admin
            </p>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-semibold">Wallet Integration</h2>
            <p className="text-gray-600 mt-2">
              Connect your Solana wallet (Phantom/Solflare) to sign actions like issuing or verifying prescriptions.
            </p>
            <div className="mt-4">
              <WalletStatus />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
