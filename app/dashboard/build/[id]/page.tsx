'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { projects as projectsApi, type Project } from '@/lib/api';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/components/providers/SoundProvider';
import Link from 'next/link';

export default function BuildPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [project, setProject] = useState<Project | null>(null);
  const [config, setConfig] = useState<Record<string, unknown>>({});
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { play } = useSound();

  const load = useCallback(() => {
    if (!id) return;
    setLoading(true);
    projectsApi
      .get(id)
      .then((r) => {
        setProject(r.project);
        setConfig((r.project.config as Record<string, unknown>) || {});
      })
      .catch(() => router.push('/dashboard'))
      .finally(() => setLoading(false));
  }, [id, router]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSend() {
    const text = message.trim();
    if (!text || !project || sending) return;
    setMessage('');
    setMessages((m) => [...m, { role: 'user', content: text }]);
    setSending(true);
    try {
      const res = await projectsApi.chat(project.id, text);
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }]);
      if (res.config) setConfig(res.config as Record<string, unknown>);
      play('success');
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: (err as Error).message }]);
      play('error');
    } finally {
      setSending(false);
    }
  }

  async function handleGenerate() {
    const text = message.trim() || 'A simple landing page with hero and footer';
    if (!project || sending) return;
    setSending(true);
    try {
      const res = await projectsApi.generate(project.id, text);
      setConfig(res.config as Record<string, unknown>);
      setMessages((m) => [...m, { role: 'assistant', content: 'I’ve generated the layout. Check the preview and tell me what to change.' }]);
      play('build');
    } catch (err) {
      setMessages((m) => [...m, { role: 'assistant', content: (err as Error).message }]);
      play('error');
    } finally {
      setSending(false);
    }
  }

  if (loading || !project) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-[var(--muted-foreground)] hover:text-foreground">
            ← Back
          </Link>
          <h1 className="font-semibold">{project.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleGenerate} disabled={sending}>
            Generate from prompt
          </Button>
          <Button size="sm" onClick={() => projectsApi.publish(project.id).then((r) => window.open(r.url))}>
            Publish
          </Button>
        </div>
      </header>
      <div className="flex-1 flex min-h-0">
        {/* Chat panel */}
        <aside className="w-full max-w-md border-r border-[var(--border)] flex flex-col shrink-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <p className="text-sm text-[var(--muted-foreground)]">
                Describe the site you want, e.g. “Build me a modern bakery website with dark mode and online menu”.
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`rounded-lg px-4 py-2 text-sm ${
                  m.role === 'user'
                    ? 'bg-[var(--primary)] text-white ml-8'
                    : 'bg-[var(--muted)] mr-8'
                }`}
              >
                {m.content}
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-[var(--border)] flex gap-2">
            <input
              type="text"
              placeholder="Describe changes or ask for something..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              className="flex-1 rounded-lg border border-[var(--border)] bg-[var(--card)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
            <Button onClick={handleSend} disabled={sending}>
              Send
            </Button>
          </div>
        </aside>
        {/* Live preview */}
        <section className="flex-1 min-w-0 flex flex-col bg-[var(--muted)]/30">
          <div className="p-2 text-xs text-[var(--muted-foreground)] border-b border-[var(--border)]">
            Live preview
          </div>
          <div className="flex-1 overflow-auto p-6">
            <PreviewFrame config={config} />
          </div>
        </section>
      </div>
    </div>
  );
}

function PreviewFrame({ config }: { config: Record<string, unknown> }) {
  const theme = (config.theme as string) || 'light';
  const components = (config.components as Array<{ id?: string; type?: string; props?: Record<string, unknown> }>) || [];
  return (
    <div
      className="mx-auto max-w-4xl rounded-xl border border-[var(--border)] bg-white shadow-lg overflow-hidden"
      data-theme={theme}
      style={{ minHeight: 400 }}
    >
      <div className="p-8">
        {components.length === 0 ? (
          <div className="text-center py-16 text-[var(--muted-foreground)] text-sm">
            Your preview will appear here. Send a message or click “Generate from prompt”.
          </div>
        ) : (
          <div className="space-y-8">
            {components.map((c, i) => (
              <Block key={c.id || i} type={c.type || 'text'} props={c.props || {}} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Block({
  type,
  props,
}: {
  type: string;
  props: Record<string, unknown>;
}) {
  const title = (props.title as string) || '';
  const text = (props.text as string) || '';
  if (type === 'hero') {
    return (
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold">{title || 'Hero heading'}</h1>
        <p className="mt-4 text-lg text-gray-600">{text || 'Subheading'}</p>
      </section>
    );
  }
  if (type === 'section') {
    return (
      <section>
        <h2 className="text-2xl font-semibold">{title || 'Section'}</h2>
        <p className="mt-2 text-gray-600">{text}</p>
      </section>
    );
  }
  return (
    <div>
      <h3 className="font-medium">{title || type}</h3>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
