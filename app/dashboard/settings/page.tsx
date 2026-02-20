'use client';

import { useEffect, useState } from 'react';
import { user as userApi, type User } from '@/lib/api';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function SettingsPage() {
  const { user: authUser, setUser, logout } = useAuth();
  const [user, setUserLocal] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    userApi
      .show()
      .then((r) => {
        setUserLocal(r.user);
        setName(r.user.name ?? '');
      })
      .catch(() => setUserLocal(null))
      .finally(() => setLoading(false));
  }, []);

  async function saveProfile() {
    setSaving(true);
    try {
      const r = await userApi.update({ name });
      setUserLocal(r.user);
      setUser?.(r.user);
    } catch {}
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-[var(--muted-foreground)] mb-8">
        Manage your account and preferences.
      </p>

      <div className="space-y-8">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Email
              </label>
              <Input value={user?.email ?? ''} readOnly className="opacity-80" />
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Email cannot be changed.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Display name
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
            <Button onClick={saveProfile} disabled={saving}>
              {saving ? 'Saving…' : 'Save profile'}
            </Button>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold mb-4">Account</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Sign out from this device. Your data remains secure.
          </p>
          <button
            type="button"
            onClick={() => {
              logout();
              window.location.href = '/login';
            }}
            className="text-sm text-rose-400 hover:text-rose-300"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
