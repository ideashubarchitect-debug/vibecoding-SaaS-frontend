'use client';

import { useEffect, useState } from 'react';
import { admin, type AdminPayment } from '@/lib/api';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<AdminPayment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin
      .payments()
      .then((r) => setPayments(r.payments))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading payments…</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Payments</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Recent transactions across all users.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Amount</th>
              <th className="text-left p-4 font-medium">Method</th>
              <th className="text-left p-4 font-medium">Status</th>
              <th className="text-left p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[var(--muted-foreground)]">
                  No payments yet.
                </td>
              </tr>
            ) : (
              payments.map((p) => (
                <tr key={p.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                  <td className="p-4">{p.id}</td>
                  <td className="p-4 font-medium">{p.email ?? `User #${p.user_id}`}</td>
                  <td className="p-4">
                    {p.currency} {Number(p.amount).toFixed(2)}
                  </td>
                  <td className="p-4">{p.method}</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        p.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)]">
                    {new Date(p.created_at).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
