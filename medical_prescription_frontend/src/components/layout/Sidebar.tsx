"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth/AuthContext";

// PUBLIC_INTERFACE
export function Sidebar() {
  /** Sidebar navigation with role-based links. */
  const { hasRole } = useAuth();
  return (
    <aside className="border-r bg-white lg:block hidden">
      <div className="h-16 border-b flex items-center px-6 font-semibold text-[var(--color-secondary)]">
        Navigation
      </div>
      <nav className="p-4 space-y-1">
        <NavLink href="/dashboard" label="Overview" />
        <NavLink href="/prescriptions" label="Prescriptions" />
        {hasRole(["doctor", "admin"]) && <NavLink href="/prescriptions/new" label="Create Prescription" />}
        {hasRole(["pharmacist", "admin"]) && <NavLink href="/verify" label="Verify Prescription" />}
      </nav>
    </aside>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block px-3 py-2 rounded hover:bg-gray-50 text-sm text-gray-700"
    >
      {label}
    </Link>
  );
}
