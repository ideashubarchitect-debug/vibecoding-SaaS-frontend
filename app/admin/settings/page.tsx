'use client';

import { useEffect, useState } from 'react';
import { admin } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [aiConfig, setAiConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    Promise.all([admin.settings(), admin.aiConfig()])
      .then(([s, a]) => {
        setSettings(s.settings ?? {});
        setAiConfig(a.config ?? {});
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function saveSettings() {
    setSaving(true);
    try {
      await admin.updateSettings(settings);
      await admin.updateAiConfig(aiConfig);
    } catch {}
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="text-[var(--muted-foreground)] animate-pulse">Loading settings…</div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Settings</h1>
      <p className="text-[var(--muted-foreground)] mb-6">
        Platform-wide configuration. AI keys are stored securely.
      </p>
      <div className="max-w-xl space-y-6">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold mb-4">General</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Key-value settings. Add or edit as needed.
          </p>
          <div className="space-y-2">
            {Object.entries(settings).map(([k, v]) => (
              <div key={k} className="flex gap-2 items-center">
                <Input
                  value={k}
                  readOnly
                  className="flex-1 font-mono text-sm"
                />
                <Input
                  value={v}
                  onChange={(e) => setSettings((s) => ({ ...s, [k]: e.target.value }))}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
          <h2 className="font-semibold mb-4">AI configuration</h2>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            Provider keys and defaults. Keys are masked in the UI.
          </p>
          <div className="space-y-2">
            {Object.entries(aiConfig).map(([k, v]) => (
              <div key={k} className="flex gap-2 items-center">
                <Input value={k} readOnly className="flex-1 font-mono text-sm" />
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={v || ''}
                  onChange={(e) => setAiConfig((a) => ({ ...a, [k]: e.target.value }))}
                  className="flex-1"
                />
              </div>
            ))}
          </div>
        </div>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving…' : 'Save all settings'}
        </Button>
      </div>
    </div>
  );
}
