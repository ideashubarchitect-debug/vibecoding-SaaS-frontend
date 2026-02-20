'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { projects as projectsApi, user as userApi, type Project } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    Promise.all([projectsApi.list(), userApi.credits()])
      .then(([r, c]) => {
        setProjects(r.projects);
        setCredits(c.credits);
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, []);

  async function createProject() {
    setCreating(true);
    try {
      const { project } = await projectsApi.create('Untitled Project');
      window.location.href = `/dashboard/build/${project.id}`;
    } catch {
      setCreating(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-[var(--muted-foreground)] mt-1">
            {credits != null && (
              <span>{credits} AI credits remaining</span>
            )}
          </p>
        </div>
        <Button onClick={createProject} disabled={creating}>
          {creating ? 'Creating…' : 'New project'}
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 animate-pulse">
              <div className="h-5 bg-[var(--muted)] rounded w-1/2" />
              <div className="h-4 bg-[var(--muted)] rounded w-1/3 mt-3" />
              <div className="h-3 bg-[var(--muted)] rounded w-1/4 mt-4" />
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border-2 border-dashed border-[var(--border)] p-16 text-center">
          <h2 className="text-lg font-semibold mb-2">No projects yet</h2>
          <p className="text-[var(--muted-foreground)] mb-6 max-w-sm mx-auto">
            Create your first project and build a website with AI. Describe what you want, and we&apos;ll generate it.
          </p>
          <Button onClick={createProject} disabled={creating} size="lg">
            Create your first project
          </Button>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <li key={p.id}>
              <Link
                href={`/dashboard/build/${p.id}`}
                className="block rounded-xl border border-[var(--border)] bg-[var(--card)] p-6 hover:border-[var(--primary)] transition"
              >
                <h2 className="font-semibold">{p.name}</h2>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {p.subdomain}.vibeable.dev
                </p>
                <div className="mt-2 flex items-center gap-2">
                  {p.published_at ? (
                    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-emerald-500/20 text-emerald-400">
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
                      Draft
                    </span>
                  )}
                  <span className="text-xs text-[var(--muted-foreground)]">
                    Updated {new Date(p.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
