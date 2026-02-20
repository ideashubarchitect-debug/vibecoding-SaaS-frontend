'use client';

import { useEffect, useState } from 'react';
import { admin, type AdminUser } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adjusting, setAdjusting] = useState<number | null>(null);
  const perPage = 20;

  useEffect(() => {
    admin
      .users(page, perPage)
      .then((r) => {
        setUsers(r.users);
        setTotal(r.total);
      })
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, [page]);

  async function adjustCredits(userId: number, delta: number) {
    setAdjusting(userId);
    try {
      await admin.adjustCredits(userId, delta);
      const r = await admin.users(page, perPage);
      setUsers(r.users);
      setTotal(r.total);
    } catch {}
    setAdjusting(null);
  }

  if (loading) {
    return (
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading users…</div>
    );
  }

  const totalPages = Math.ceil(total / perPage);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Users</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        {total} users • Page {page} of {totalPages || 1}
      </p>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
              <th className="text-left p-4 font-medium">ID</th>
              <th className="text-left p-4 font-medium">Email</th>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium">Role</th>
              <th className="text-left p-4 font-medium">Credits</th>
              <th className="text-left p-4 font-medium">Joined</th>
              <th className="text-left p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                <td className="p-4">{u.id}</td>
                <td className="p-4 font-medium">{u.email}</td>
                <td className="p-4 text-[var(--muted-foreground)]">{u.name || '—'}</td>
                <td className="p-4">
                  <span
                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === 'admin' ? 'bg-amber-500/20 text-amber-500' : 'bg-[var(--muted)] text-[var(--muted-foreground)]'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-4">{u.credits}</td>
                <td className="p-4 text-[var(--muted-foreground)]">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => adjustCredits(u.id, 10)}
                    disabled={adjusting === u.id}
                    className="text-xs px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                  >
                    +10
                  </button>
                  <button
                    type="button"
                    onClick={() => adjustCredits(u.id, -10)}
                    disabled={adjusting === u.id}
                    className="text-xs px-2 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30"
                  >
                    -10
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="mt-4 flex gap-2">
          <Button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
            Previous
          </Button>
          <Button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
