'use client';

import { useEffect, useState } from 'react';
import { admin, type Plan } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<Plan>>({});

  useEffect(() => {
    admin
      .plans()
      .then((r) => setPlans(r.plans))
      .catch(() => setPlans([]))
      .finally(() => setLoading(false));
  }, []);

  function startEdit(plan: Plan) {
    setEditing(plan.id);
    setForm({
      name: plan.name,
      slug: plan.slug,
      price_monthly: plan.price_monthly,
      price_yearly: plan.price_yearly,
      credits_per_month: plan.credits_per_month,
    });
  }

  async function saveEdit() {
    if (!editing) return;
    try {
      await admin.updatePlan(editing, form);
      const r = await admin.plans();
      setPlans(r.plans);
      setEditing(null);
    } catch {}
  }

  if (loading) {
    return (
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading plans…</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Plans</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Manage pricing and features. Changes apply to new subscriptions.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6"
          >
            {editing === plan.id ? (
              <>
                <Input
                  placeholder="Name"
                  value={form.name ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="mb-2"
                />
                <Input
                  placeholder="Slug"
                  value={form.slug ?? ''}
                  onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                  className="mb-2"
                />
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <Input
                    placeholder="Monthly $"
                    type="number"
                    value={String(form.price_monthly ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, price_monthly: Number(e.target.value) }))}
                  />
                  <Input
                    placeholder="Credits/mo"
                    type="number"
                    value={String(form.credits_per_month ?? '')}
                    onChange={(e) => setForm((f) => ({ ...f, credits_per_month: Number(e.target.value) }))}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={saveEdit}>Save</Button>
                  <Button onClick={() => setEditing(null)} variant="secondary">
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <p className="mt-1 text-2xl font-bold">
                  ${Number(plan.price_monthly)}<span className="text-sm font-normal text-[var(--muted-foreground)]">/mo</span>
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {plan.credits_per_month} credits/month
                </p>
                <Button onClick={() => startEdit(plan)} className="mt-4" variant="secondary">
                  Edit plan
                </Button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
