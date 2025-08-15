"use client";

import Link from "next/link";
import { Shell } from "@/components/layout/Shell";
import { Protected } from "@/components/layout/Protected";
import { useAuth } from "@/components/auth/AuthContext";

export default function DashboardPage() {
  const { user, roles } = useAuth();
  return (
    <Protected>
      <Shell>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Welcome</h2>
            <p className="text-gray-600 mt-2">
              Hello {user?.full_name || user?.email}. Your roles: {roles.join(", ") || "-"}
            </p>
          </div>
          <div className="card p-5">
            <h2 className="text-lg font-semibold">Prescriptions</h2>
            <p className="text-gray-600 mt-2">View and manage your prescriptions.</p>
            <Link href="/prescriptions" className="btn btn-primary mt-3 px-4 py-2 inline-block">
              Open list
            </Link>
          </div>
          <div className="card p-5">
            <h2 className="text-lg font-semibold">On-chain</h2>
            <p className="text-gray-600 mt-2">Connect wallet to sign/verify actions.</p>
            <Link href="/verify" className="btn btn-accent mt-3 px-4 py-2 inline-block">
              Verification
            </Link>
          </div>
        </div>
      </Shell>
    </Protected>
  );
}
