'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { admin } from '@/lib/api';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<{
    users: number;
    payments: number;
    usageTotal: number;
  } | null>(null);

  useEffect(() => {
    Promise.all([
      admin.users(1, 1),
      admin.payments(),
      admin.usage(),
    ])
      .then(([u, p, us]) => {
        const totalTokens = (us.usage ?? []).reduce((s: number, x: { tokens: number }) => s + Number(x.tokens), 0);
        setStats({
          users: u.total ?? 0,
          payments: (p.payments ?? []).length,
          usageTotal: totalTokens,
        });
      })
      .catch(() => setStats({ users: 0, payments: 0, usageTotal: 0 }));
  }, []);

  const cards = [
    {
      href: '/admin/users',
      label: 'Users',
      desc: 'Manage accounts',
      value: stats?.users ?? '—',
      suffix: 'total',
    },
    {
      href: '/admin/plans',
      label: 'Plans',
      desc: 'Pricing & features',
      value: null,
    },
    {
      href: '/admin/payments',
      label: 'Payments',
      desc: 'Transactions',
      value: stats?.payments ?? '—',
      suffix: 'recent',
    },
    {
      href: '/admin/usage',
      label: 'AI Usage',
      desc: 'Token & credits',
      value: stats?.usageTotal != null ? stats.usageTotal.toLocaleString() : '—',
      suffix: 'tokens',
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Admin overview</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Platform stats at a glance. Click a card to manage.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition"
          >
            <h2 className="font-semibold">{c.label}</h2>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">{c.desc}</p>
            {c.value != null && (
              <p className="mt-3 text-2xl font-bold text-[var(--primary)]">
                {c.value}
                {c.suffix && (
                  <span className="text-sm font-normal text-[var(--muted-foreground)] ml-1">
                    {c.suffix}
                  </span>
                )}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
