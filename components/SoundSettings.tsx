'use client';

import { useSound, type SoundTheme } from '@/components/providers/SoundProvider';
import { Button } from '@/components/ui/Button';

const THEMES: { value: SoundTheme; label: string }[] = [
  { value: 'minimal', label: 'Minimal' },
  { value: 'playful', label: 'Playful' },
  { value: 'retro', label: 'Retro' },
  { value: 'scifi', label: 'Sci-Fi' },
  { value: 'off', label: 'Off' },
];

export function SoundSettings() {
  const { theme, setTheme, enabled, setEnabled, volume, setVolume } = useSound();

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-4 space-y-4">
      <h3 className="font-medium">Sound</h3>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => setEnabled(e.target.checked)}
          className="rounded border-[var(--border)]"
        />
        <span className="text-sm">Enable sounds</span>
      </label>
      <div>
        <p className="text-sm text-[var(--muted-foreground)] mb-2">Theme</p>
        <div className="flex flex-wrap gap-2">
          {THEMES.map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setTheme(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm text-[var(--muted-foreground)] mb-2">Volume</p>
        <input
          type="range"
          min={0}
          max={1}
          step={0.1}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-full accent-[var(--primary)]"
        />
      </div>
    </div>
  );
}
