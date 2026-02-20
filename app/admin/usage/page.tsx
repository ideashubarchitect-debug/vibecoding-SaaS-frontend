'use client';

import { useEffect, useState } from 'react';
import { admin, type AdminUsage } from '@/lib/api';

export default function AdminUsagePage() {
  const [usage, setUsage] = useState<AdminUsage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin
      .usage()
      .then((r) => setUsage(r.usage))
      .catch(() => setUsage([]))
      .finally(() => setLoading(false));
  }, []);

  const totalTokens = usage.reduce((s, u) => s + Number(u.tokens), 0);

  if (loading) {
    return (
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading usage…</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">AI Usage</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Token usage by day. Total: <strong className="text-foreground">{totalTokens.toLocaleString()}</strong> tokens
        (last 90 days).
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--muted-foreground)]">Total tokens</p>
          <p className="text-2xl font-bold mt-1">{totalTokens.toLocaleString()}</p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4">
          <p className="text-sm text-[var(--muted-foreground)]">Days tracked</p>
          <p className="text-2xl font-bold mt-1">{usage.length}</p>
        </div>
      </div>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left p-4 font-medium">Date</th>
              <th className="text-left p-4 font-medium">Tokens</th>
              <th className="text-left p-4 font-medium">Active users</th>
            </tr>
          </thead>
          <tbody>
            {usage.map((u) => (
              <tr key={u.date} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                <td className="p-4 font-medium">{u.date}</td>
                <td className="p-4">{Number(u.tokens).toLocaleString()}</td>
                <td className="p-4">{u.users}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
