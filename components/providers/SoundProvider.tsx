'use client';

import { createContext, useContext, useState, useCallback, useRef, ReactNode } from 'react';

export type SoundTheme = 'minimal' | 'playful' | 'retro' | 'scifi' | 'off';

type SoundContextType = {
  theme: SoundTheme;
  setTheme: (t: SoundTheme) => void;
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  play: (sound: 'click' | 'success' | 'error' | 'build') => void;
};

const SoundContext = createContext<SoundContextType | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<SoundTheme>('minimal');
  const [enabled, setEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(
    (sound: 'click' | 'success' | 'error' | 'build') => {
      if (!enabled || theme === 'off' || volume <= 0) return;
      // In production, load theme-specific sounds: /sounds/{theme}/{sound}.mp3
      try {
        const a = new Audio(`/sounds/${theme}/${sound}.mp3`);
        a.volume = volume;
        a.play().catch(() => {});
      } catch {
        // No file or unsupported
      }
    },
    [enabled, theme, volume]
  );

  return (
    <SoundContext.Provider value={{ theme, setTheme, enabled, setEnabled, volume, setVolume, play }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error('useSound must be used within SoundProvider');
  return ctx;
}

// Fix typo in type name
type SoundContextContextType = SoundContextType;
