"use client";

import Link from "next/link";
import { PrescriptionOut } from "@/lib/api";
import { prettyDate } from "@/lib/helpers";

// PUBLIC_INTERFACE
export function PrescriptionCard({ item }: { item: PrescriptionOut }) {
  /** Card for displaying minimal prescription information. */
  return (
    <Link href={`/prescriptions/${item.id}`} className="block card p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-500">{item.number}</div>
          <div className="text-lg font-semibold text-[var(--color-primary)]">{item.drug_name}</div>
          <div className="text-sm text-gray-600">{item.dosage ?? "-"} • Qty {item.quantity ?? "-"} {item.units ?? ""}</div>
        </div>
        <div className="text-right">
          <div className="text-sm">
            <span className="inline-flex px-2 py-1 rounded bg-gray-100 text-gray-700">{item.status}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">Issued: {prettyDate(item.issue_date)}</div>
        </div>
      </div>
    </Link>
  );
}
