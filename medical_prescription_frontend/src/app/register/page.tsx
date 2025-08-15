"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Role } from "@/lib/api";
import { useAuth } from "@/components/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<Role>("doctor");
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
      await register({ email, password, role, full_name: fullName });
      router.replace("/dashboard");
    } catch {
      setError("Registration failed. Try a different email or stronger password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="card p-6 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-[var(--color-primary)]">Register</h1>
        <p className="text-gray-600 mt-1">Create an account to start using MedVerify.</p>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <Input label="Full name" placeholder="Dr. Jane Doe" value={fullName} onChange={(e) => setFullName(e.currentTarget.value)} />
          <Input type="email" label="Email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.currentTarget.value)} />
          <Input type="password" label="Password" placeholder="At least 8 characters" required value={password} onChange={(e) => setPassword(e.currentTarget.value)} />
          <Select label="Role" value={role} onChange={(e) => setRole(e.currentTarget.value as Role)}>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="patient">Patient</option>
            <option value="admin">Admin</option>
          </Select>
          <Button className="w-full px-4 py-2" disabled={submitting}>{submitting ? "Creating..." : "Register"}</Button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-[var(--color-secondary)] hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
