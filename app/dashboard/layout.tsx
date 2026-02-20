'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

function LogoutLink() {
  const { logout } = useAuth();
  return (
    <button
      type="button"
      onClick={() => { logout(); window.location.href = '/login'; }}
      className="text-sm text-[var(--muted-foreground)] hover:text-foreground"
    >
      Log out
    </button>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
      return;
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-[var(--muted-foreground)]">Loading…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-semibold">vibeable.dev</Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className={`text-sm ${pathname === '/dashboard' ? 'text-foreground font-medium' : 'text-[var(--muted-foreground)] hover:text-foreground'}`}
          >
            Projects
          </Link>
          <Link
            href="/dashboard/billing"
            className={`text-sm ${pathname === '/dashboard/billing' ? 'text-foreground font-medium' : 'text-[var(--muted-foreground)] hover:text-foreground'}`}
          >
            Billing
          </Link>
          <Link
            href="/dashboard/settings"
            className={`text-sm ${pathname?.startsWith('/dashboard/settings') ? 'text-foreground font-medium' : 'text-[var(--muted-foreground)] hover:text-foreground'}`}
          >
            Settings
          </Link>
          {user.role === 'admin' && (
            <Link href="/admin" className="text-sm text-amber-400 hover:text-amber-300">
              Admin
            </Link>
          )}
          <span className="text-sm text-[var(--muted-foreground)]">{user.email}</span>
          <LogoutLink />
        </nav>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
