'use client';

import { useEffect, useState } from 'react';
import { plans, user as userApi, subscriptions, type Plan, type Invoice } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function BillingPage() {
  const [planList, setPlanList] = useState<Plan[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<{ plan_name?: string; status?: string; current_period_end?: string } | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      plans.list(),
      userApi.credits(),
      subscriptions.list(),
      subscriptions.invoices(),
    ])
      .then(([p, c, s, i]) => {
        setPlanList(p.plans);
        setCredits(c.credits);
        setSubscription(s.subscription ?? null);
        setInvoices(i.invoices ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function upgrade(planId: number) {
    setUpgrading(planId);
    try {
      await subscriptions.create(planId);
      const [c, s] = await Promise.all([userApi.credits(), subscriptions.list()]);
      setCredits(c.credits);
      setSubscription(s.subscription ?? null);
    } catch {}
    setUpgrading(null);
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading…</div>
      </div>
    );
  }

  const featuresList = (plan: Plan) => {
    const f = plan.features;
    if (Array.isArray(f)) return f;
    if (typeof f === 'string') {
      try {
        const parsed = JSON.parse(f);
        return Array.isArray(parsed) ? parsed : [f];
      } catch {
        return [f];
      }
    }
    return [];
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Billing & plans</h1>
      <p className="text-[var(--muted-foreground)] mb-8">
        Manage your subscription and credits.
      </p>

      {/* Current status */}
      <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 mb-8">
        <h2 className="font-semibold mb-4">Current status</h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">Credits</p>
            <p className="text-2xl font-bold mt-1">{credits ?? 0}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">AI credits remaining</p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">Plan</p>
            <p className="text-xl font-bold mt-1">{subscription?.plan_name ?? 'Free'}</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5 capitalize">
              {subscription?.status ?? 'Active'}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--muted-foreground)]">Renews</p>
            <p className="text-xl font-bold mt-1">
              {subscription?.current_period_end
                ? new Date(subscription.current_period_end).toLocaleDateString()
                : '—'}
            </p>
          </div>
        </div>
      </div>

      {/* Plans */}
      <h2 className="font-semibold mb-4">Plans</h2>
      <div className="grid gap-6 sm:grid-cols-3 mb-10">
        {planList.map((plan) => {
          const isCurrent = subscription?.plan_name === plan.name;
          const isPro = plan.slug !== 'free';
          return (
            <div
              key={plan.id}
              className={`rounded-xl border p-6 flex flex-col ${
                isPro ? 'border-[var(--primary)] bg-[var(--primary)]/5' : 'border-[var(--border)] bg-[var(--card)]'
              }`}
            >
              {isPro && (
                <span className="text-xs font-medium text-[var(--primary)] uppercase tracking-wide mb-2">
                  Popular
                </span>
              )}
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <p className="mt-2 text-2xl font-bold">
                ${Number(plan.price_monthly)}
                <span className="text-sm font-normal text-[var(--muted-foreground)]">/mo</span>
              </p>
              {plan.price_yearly > 0 && (
                <p className="text-sm text-[var(--muted-foreground)]">
                  ${Number(plan.price_yearly)}/year (save 17%)
                </p>
              )}
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {plan.credits_per_month} AI credits/month
              </p>
              <ul className="mt-4 space-y-2 text-sm flex-1">
                {featuresList(plan).map((f: string, i: number) => (
                  <li key={i} className="flex items-center gap-2">
                    <span className="text-[var(--primary)]">✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => upgrade(plan.id)}
                disabled={isCurrent || upgrading === plan.id}
                variant={isCurrent ? 'secondary' : 'primary'}
                className="mt-6 w-full"
              >
                {isCurrent ? 'Current plan' : upgrading === plan.id ? 'Upgrading…' : plan.slug === 'free' ? 'Current plan' : 'Upgrade'}
              </Button>
            </div>
          );
        })}
      </div>

      {/* Invoices */}
      <h2 className="font-semibold mb-4">Invoice history</h2>
      {invoices.length === 0 ? (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-8 text-center text-[var(--muted-foreground)]">
          No invoices yet. Invoices are generated when you upgrade or renew.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]/30">
                <th className="text-left p-4 font-medium">Date</th>
                <th className="text-left p-4 font-medium">Amount</th>
                <th className="text-left p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/10">
                  <td className="p-4">{new Date(inv.created_at).toLocaleDateString()}</td>
                  <td className="p-4 font-medium">
                    {inv.currency} {Number(inv.amount).toFixed(2)}
                  </td>
                  <td className="p-4">
                    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      {inv.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 text-sm text-[var(--muted-foreground)]">
        Payment methods: PayPal and more. Invoices are generated automatically on upgrade.
      </p>
    </div>
  );
}
