import type { Metadata } from 'next';
import './globals.css';
import { SoundProvider } from '@/components/providers/SoundProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

export const metadata: Metadata = {
  title: 'vibeable.dev — AI Website Builder',
  description: 'Create and publish professional websites through natural language.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <AuthProvider>
          <SoundProvider>{children}</SoundProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
