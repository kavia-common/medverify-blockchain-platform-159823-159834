"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthContext";

// PUBLIC_INTERFACE
export function Protected({ children, roles }: { children: React.ReactNode; roles?: Role[] }) {
  /** Client-side protection: requires authentication and (optionally) specific roles. */
  const { isAuthenticated, loading, hasRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (roles && !hasRole(roles)) {
        router.replace("/dashboard");
      }
    }
  }, [loading, isAuthenticated, hasRole, roles, router]);

  if (loading || !isAuthenticated) {
    return <div className="container-page py-10 text-gray-600">Loading...</div>;
  }

  if (roles && !hasRole(roles)) {
    return <div className="container-page py-10 text-red-600">Insufficient permissions.</div>;
  }

  return <>{children}</>;
}
