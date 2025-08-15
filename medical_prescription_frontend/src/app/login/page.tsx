"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isAuthenticated) {
    router.replace("/dashboard");
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      router.replace("/dashboard");
    } catch {
      setError("Login failed. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Login</h1>
        <p className="text-gray-600 mt-1">Access your MedVerify dashboard.</p>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input type="email" label="Email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
          <Input type="password" label="Password" placeholder="********" required value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
          <Button className="w-full px-4 py-2" disabled={submitting}>{submitting ? "Signing in..." : "Login"}</Button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          New here?{" "}
          <Link href="/register" className="text-[var(--color-secondary)] hover:underline">
            Create an account
          </Link>
        </p>
      </div>
    </main>
  );
}
