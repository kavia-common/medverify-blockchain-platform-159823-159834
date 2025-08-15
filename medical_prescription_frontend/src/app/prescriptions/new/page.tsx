"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Protected } from "@/components/layout/Protected";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthContext";
import { apiCreatePrescription } from "@/lib/api";
import { useRouter } from "next/navigation";
import { useWallet } from "@/components/wallet/WalletContext";

export default function NewPrescriptionPage() {
  const { token } = useAuth();
  const router = useRouter();
  const wallet = useWallet();

  const [form, setForm] = useState({
    patient_email: "",
    drug_name: "",
    dosage: "",
    quantity: "",
    units: "",
    frequency: "",
    duration_days: "",
    instructions: "",
    expires_at: "",
    issue_on_chain: false,
  });
  const [signResult, setSignResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const signIntent = async () => {
    try {
      const signed = await wallet.signText(`Create Rx: ${form.drug_name}`);
      setSignResult(signed);
    } catch {
      setSignResult(null);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload = {
        patient_email: form.patient_email || undefined,
        drug_name: form.drug_name,
        dosage: form.dosage || undefined,
        quantity: form.quantity ? Number(form.quantity) : undefined,
        units: form.units || undefined,
        frequency: form.frequency || undefined,
        duration_days: form.duration_days ? Number(form.duration_days) : undefined,
        instructions: form.instructions || undefined,
        expires_at: form.expires_at || undefined,
        issue_on_chain: !!form.issue_on_chain,
      };
      const created = await apiCreatePrescription(token, payload);
      router.replace(`/prescriptions/${created.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to create prescription";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Protected roles={["doctor", "admin"]}>
      <Shell>
        <h1 className="text-xl font-semibold">Create Prescription</h1>
        <form className="grid md:grid-cols-2 gap-4 mt-4" onSubmit={onSubmit}>
          <div className="card p-4 space-y-4">
            <Input label="Patient Email" name="patient_email" placeholder="patient@example.com" value={form.patient_email} onChange={onChange} />
            <Input label="Drug Name" name="drug_name" placeholder="Amoxicillin" required value={form.drug_name} onChange={onChange} />
            <Input label="Dosage" name="dosage" placeholder="500mg" value={form.dosage} onChange={onChange} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Quantity" name="quantity" type="number" placeholder="10" value={form.quantity} onChange={onChange} />
              <Input label="Units" name="units" placeholder="tablets" value={form.units} onChange={onChange} />
            </div>
            <Input label="Frequency" name="frequency" placeholder="2x/day" value={form.frequency} onChange={onChange} />
            <Input label="Duration (days)" name="duration_days" type="number" placeholder="7" value={form.duration_days} onChange={onChange} />
            <Input label="Instructions" name="instructions" placeholder="After meals" value={form.instructions} onChange={onChange} />
            <Input label="Expires At" name="expires_at" type="date" value={form.expires_at} onChange={onChange} />
            <label className="flex items-center gap-2">
              <input type="checkbox" name="issue_on_chain" checked={form.issue_on_chain} onChange={onChange} />
              <span>Record on chain</span>
            </label>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            <Button className="px-4 py-2" disabled={submitting}>{submitting ? "Creating..." : "Create"}</Button>
          </div>
          <div className="card p-4">
            <h2 className="text-lg font-semibold">Wallet Signing</h2>
            <p className="text-gray-600 mt-1">
              Optional: sign the creation intent to keep a cryptographic proof.
            </p>
            <div className="mt-3 flex gap-2">
              <Button type="button" variant="accent" className="px-4 py-2" onClick={signIntent}>
                Sign Create Intent
              </Button>
            </div>
            {signResult && (
              <div className="mt-3">
                <div className="text-sm text-gray-700">Signature (base64)</div>
                <code className="block text-xs break-words bg-gray-50 p-2 rounded">{signResult}</code>
              </div>
            )}
          </div>
        </form>
      </Shell>
    </Protected>
  );
}
