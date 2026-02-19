'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { projects as projectsApi, type Project } from '@/lib/api';
import { Button } from '@/components/ui/Button';

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    projectsApi
      .list()
      .then((r) => setProjects(r.projects))
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
        <h1 className="text-2xl font-bold">Projects</h1>
        <Button onClick={createProject} disabled={creating}>
          {creating ? 'Creating…' : 'New project'}
        </Button>
      </div>
      {loading ? (
        <div className="text-[var(--muted-foreground)]">Loading projects…</div>
      ) : projects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[var(--border)] p-12 text-center">
          <p className="text-[var(--muted-foreground)] mb-4">No projects yet.</p>
          <Button onClick={createProject} disabled={creating}>
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
                <p className="mt-2 text-xs text-[var(--muted-foreground)]">
                  Updated {new Date(p.updated_at).toLocaleDateString()}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
