"use client";

import React, { useEffect, useState } from "react";
import { Shell } from "@/components/layout/Shell";
import { Protected } from "@/components/layout/Protected";
import { useAuth } from "@/components/auth/AuthContext";
import { apiListPrescriptions, PrescriptionOut } from "@/lib/api";
import { PrescriptionCard } from "@/components/PrescriptionCard";

export default function PrescriptionsPage() {
  const { token } = useAuth();
  const [items, setItems] = useState<PrescriptionOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    apiListPrescriptions(token)
      .then(setItems)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <Protected>
      <Shell>
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Prescriptions</h1>
        </div>
        <div className="mt-4">
          {loading && <div className="text-gray-600">Loading...</div>}
          {err && <div className="text-red-600">{err}</div>}
          {!loading && !err && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((it) => (
                <PrescriptionCard key={it.id} item={it} />
              ))}
              {items.length === 0 && <div className="text-gray-600">No prescriptions found.</div>}
            </div>
          )}
        </div>
      </Shell>
    </Protected>
  );
}
