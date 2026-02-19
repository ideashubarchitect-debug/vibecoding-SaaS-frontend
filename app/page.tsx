import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <span className="text-xl font-semibold">vibeable.dev</span>
        <nav className="flex items-center gap-4">
          <Link href="/login" className="text-sm text-[var(--muted-foreground)] hover:text-foreground">
            Log in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Get started
          </Link>
        </nav>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight max-w-3xl">
          Build websites with <span className="text-[var(--primary)]">words</span>, not code.
        </h1>
        <p className="mt-6 text-lg text-[var(--muted-foreground)] max-w-xl">
          Describe what you want in plain English. Our AI creates, edits, and publishes your site in real time.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <Link
            href="/register"
            className="rounded-xl bg-[var(--primary)] px-8 py-4 text-lg font-medium text-white hover:opacity-90 transition"
          >
            Start building free
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-[var(--border)] px-8 py-4 text-lg font-medium hover:bg-[var(--muted)] transition"
          >
            Sign in
          </Link>
        </div>
        <p className="mt-8 text-sm text-[var(--muted-foreground)]">
          Free tier: 100 AI credits/month. No credit card required.
        </p>
      </main>
    </div>
  );
}
