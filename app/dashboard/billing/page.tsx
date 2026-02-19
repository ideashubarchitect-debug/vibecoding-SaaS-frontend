'use client';

import { useEffect, useState } from 'react';
import { plans, user as userApi } from '@/lib/api';
import type { Plan } from '@/lib/api';

export default function BillingPage() {
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([plans.list(), userApi.credits()])
      .then(([p, c]) => {
        setPlanList(p.plans);
        setCredits(c.credits);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Billing</h1>
      <p className="text-[var(--muted-foreground)] mb-8">
        Your current credits: <strong className="text-foreground">{credits ?? 0}</strong>
      </p>
      <div className="grid gap-6 sm:grid-cols-3">
        {planList.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 flex flex-col"
          >
            <h2 className="text-lg font-semibold">{plan.name}</h2>
            <p className="mt-2 text-2xl font-bold">
              ${Number(plan.price_monthly)}<span className="text-sm font-normal text-[var(--muted-foreground)]">/mo</span>
            </p>
            <p className="mt-1 text-sm text-[var(--muted-foreground)]">
              {plan.credits_per_month} AI credits/month
            </p>
            <ul className="mt-4 space-y-2 text-sm flex-1">
              {(() => {
                const features = typeof plan.features === 'string'
                  ? (() => { try { return JSON.parse(plan.features); } catch { return [plan.features]; } })()
                  : plan.features;
                return Array.isArray(features)
                  ? features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="text-[var(--primary)]">✓</span> {f}
                      </li>
                    ))
                  : null;
              })()}
            </ul>
            <button
              type="button"
              className="mt-6 w-full rounded-lg bg-[var(--primary)] py-2.5 text-sm font-medium text-white hover:opacity-90"
            >
              {plan.slug === 'free' ? 'Current plan' : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-[var(--muted-foreground)]">
        Payment methods: PayPal and manual bank transfer. Invoices are generated automatically.
      </p>
    </div>
  );
}
