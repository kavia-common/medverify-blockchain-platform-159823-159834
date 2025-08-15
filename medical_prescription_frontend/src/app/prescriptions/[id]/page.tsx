"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Shell } from "@/components/layout/Shell";
import { Protected } from "@/components/layout/Protected";
import { useAuth } from "@/components/auth/AuthContext";
import { apiGetPrescription, apiVerifyPrescription, PrescriptionOut } from "@/lib/api";
import { prettyDate } from "@/lib/helpers";
import { Button } from "@/components/ui/Button";
import { useWallet } from "@/components/wallet/WalletContext";

export default function PrescriptionDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { token, hasRole } = useAuth();
  const router = useRouter();
  const wallet = useWallet();

  const [rx, setRx] = useState<PrescriptionOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [signResult, setSignResult] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !id) return;
    setLoading(true);
    apiGetPrescription(token, id)
      .then(setRx)
      .catch((e) => setErr(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, [token, id]);

  const signVerify = async () => {
    try {
      const s = await wallet.signText(`Verify Rx: ${rx?.id}`);
      setSignResult(s);
    } catch {
      setSignResult(null);
    }
  };

  const verify = async () => {
    if (!token || !id) return;
    setVerifying(true);
    setErr(null);
    try {
      const updated = await apiVerifyPrescription(token, id, { verify_on_chain: true, mark_verified: true });
      setRx(updated);
    } catch (e) {
      const message = e instanceof Error ? e.message : "Verification failed";
      setErr(message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <Protected>
      <Shell>
        {loading && <div className="text-gray-600">Loading...</div>}
        {err && <div className="text-red-600">{err}</div>}
        {rx && (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h1 className="text-xl font-semibold">{rx.number}</h1>
              <div className="mt-2 text-gray-600">Drug: <span className="font-medium text-gray-800">{rx.drug_name}</span></div>
              <div className="mt-2 text-gray-600">Dosage: {rx.dosage ?? "-"}</div>
              <div className="mt-2 text-gray-600">Quantity: {rx.quantity ?? "-"} {rx.units ?? ""}</div>
              <div className="mt-2 text-gray-600">Frequency: {rx.frequency ?? "-"}</div>
              <div className="mt-2 text-gray-600">Duration: {rx.duration_days ?? "-"} days</div>
              <div className="mt-2 text-gray-600">Instructions: {rx.instructions ?? "-"}</div>
              <div className="mt-2 text-gray-600">Issued: {prettyDate(rx.issue_date)}</div>
              <div className="mt-2 text-gray-600">Expires: {prettyDate(rx.expires_at)}</div>
              <div className="mt-3">
                <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-700">Status: {rx.status}</span>
              </div>
              <div className="mt-3 text-sm text-gray-600">
                Network: {rx.chain_network ?? "-"} • Tx: {rx.chain_tx_signature ? `${rx.chain_tx_signature.slice(0, 8)}...` : "-"}
              </div>
            </div>
            <div className="card p-4">
              <h2 className="text-lg font-semibold">Actions</h2>
              {hasRole(["pharmacist", "admin"]) ? (
                <>
                  <p className="text-gray-600 mt-1">Pharmacist can verify this prescription.</p>
                  <div className="mt-3 flex gap-2">
                    <Button variant="accent" className="px-4 py-2" onClick={signVerify}>Sign Verify Intent</Button>
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
                </>
              ) : (
                <p className="text-gray-600 mt-1">No actions available for your role.</p>
              )}
              <div className="mt-4">
                <Button variant="secondary" className="px-4 py-2" onClick={() => router.push("/prescriptions")}>
                  Back to list
                </Button>
              </div>
            </div>
          </div>
        )}
      </Shell>
    </Protected>
  );
}
