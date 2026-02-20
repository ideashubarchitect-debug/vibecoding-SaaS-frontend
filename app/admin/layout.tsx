'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading…</div>
      </div>
    );
  }

  const nav = [
    { href: '/admin', label: 'Overview' },
    { href: '/admin/users', label: 'Users' },
    { href: '/admin/plans', label: 'Plans' },
    { href: '/admin/payments', label: 'Payments' },
    { href: '/admin/usage', label: 'AI Usage' },
    { href: '/admin/activity', label: 'Activity' },
    { href: '/admin/settings', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen flex">
      <aside className="w-56 border-r border-[var(--border)] p-4 flex flex-col">
        <Link href="/admin" className="font-semibold mb-6">Admin</Link>
        <nav className="space-y-1">
          {nav.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-lg px-3 py-2 text-sm ${
                pathname === href || (href !== '/admin' && pathname.startsWith(href)) ? 'bg-[var(--muted)]' : 'text-[var(--muted-foreground)] hover:text-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
        <Link href="/dashboard" className="mt-auto text-sm text-[var(--muted-foreground)] hover:text-foreground">
          ← Dashboard
        </Link>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
