"use client";

import React, { useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Protected } from "@/components/layout/Protected";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/components/auth/AuthContext";
import { apiGetPrescription, apiVerifyPrescription, PrescriptionOut } from "@/lib/api";
import { prettyDate } from "@/lib/helpers";
import Link from "next/link";
import { useWallet } from "@/components/wallet/WalletContext";

export default function VerifyPage() {
  const { token } = useAuth();
  const wallet = useWallet();
  const [id, setId] = useState("");
  const [item, setItem] = useState<PrescriptionOut | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [signResult, setSignResult] = useState<string | null>(null);

  const fetchItem = async () => {
    if (!token || !id) return;
    setError(null);
    setLoading(true);
    try {
      const it = await apiGetPrescription(token, id);
      setItem(it);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Not found";
      setItem(null);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const signIntent = async () => {
    try {
      const s = await wallet.signText(`Verify Rx: ${id}`);
      setSignResult(s);
    } catch {
      setSignResult(null);
    }
  };

  const verify = async () => {
    if (!token || !id) return;
    setVerifying(true);
    setError(null);
    try {
      const updated = await apiVerifyPrescription(token, id, { verify_on_chain: true, mark_verified: true });
      setItem(updated);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Verification failed";
      setError(message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Protected roles={["pharmacist", "admin"]}>
      <Shell>
        <h1 className="text-xl font-semibold">Verify Prescription</h1>
        <div className="card p-4 mt-4">
          <div className="grid sm:grid-cols-5 gap-3">
            <div className="sm:col-span-4">
              <Input label="Prescription ID" placeholder="UUID" value={id} onChange={(e) => setId(e.currentTarget.value)} />
            </div>
            <div className="flex items-end">
              <Button className="px-4 py-2" onClick={fetchItem} disabled={loading}>
                {loading ? "Loading..." : "Fetch"}
              </Button>
            </div>
          </div>
          {error && <div className="text-red-600 mt-3">{error}</div>}
        </div>

        {item && (
          <div className="card p-4 mt-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500">{item.number}</div>
                <div className="text-lg font-semibold">{item.drug_name}</div>
                <div className="text-sm text-gray-600">Status: {item.status} • Expires: {prettyDate(item.expires_at)}</div>
              </div>
              <Link href={`/prescriptions/${item.id}`} className="btn btn-secondary px-3 py-2">
                Open
              </Link>
            </div>
            <div className="mt-4 flex gap-2">
              <Button variant="accent" className="px-4 py-2" onClick={signIntent}>Sign Verify Intent</Button>
              <Button className="px-4 py-2" onClick={verify} disabled={verifying}>
                {verifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
            {signResult && (
              <div className="mt-3">
                <div className="text-sm text-gray-700">Signature (base64)</div>
                <code className="block text-xs break-words bg-gray-50 p-2 rounded">{signResult}</code>
              </div>
            )}
          </div>
        )}
      </Shell>
    </Protected>
  );
}
