'use client';

import { useEffect, useState } from 'react';
import { admin, type ActivityLog } from '@/lib/api';

export default function AdminActivityPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    admin
      .activity()
      .then((r) => setLogs(r.logs))
      .catch(() => setLogs([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading activity…</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Activity log</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Recent system activity. Last 200 events.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">User</th>
              <th className="text-left p-4 font-medium">Action</th>
              <th className="text-left p-4 font-medium">Entity</th>
              <th className="text-left p-4 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-[var(--muted-foreground)]">
                  No activity yet.
                </td>
              </tr>
            ) : (
              logs.map((l) => (
                <tr key={l.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                  <td className="p-4">{l.id}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">
                    {l.user_id ?? '—'}
                  </td>
                  <td className="p-4 font-medium">{l.action}</td>
                  <td className="p-4 text-[var(--muted-foreground)]">
                    {l.entity_type ? `${l.entity_type} #${l.entity_id}` : '—'}
                  </td>
                  <td className="p-4 text-[var(--muted-foreground)]">
                    {new Date(l.created_at).toLocaleString()}
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
