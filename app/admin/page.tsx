'use client';

import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/users" className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]">
          <h2 className="font-semibold">Users</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Manage accounts</p>
        </Link>
        <Link href="/admin/plans" className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]">
          <h2 className="font-semibold">Plans</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Pricing & features</p>
        </Link>
        <Link href="/admin/payments" className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]">
          <h2 className="font-semibold">Payments</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Transactions</p>
        </Link>
        <Link href="/admin/usage" className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)]">
          <h2 className="font-semibold">AI usage</h2>
          <p className="mt-1 text-sm text-[var(--muted-foreground)]">Token & credits</p>
        </Link>
      </div>
    </div>
  );
}
