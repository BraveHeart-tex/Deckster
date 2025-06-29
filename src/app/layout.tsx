import Header from '@/components/common/Header';
import { ConvexClientProvider } from '@/components/ConvexClientProvider';
import {
  ConvexAuthNextjsServerProvider,
  isAuthenticatedNextjs,
} from '@convex-dev/auth/nextjs/server';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Scrum Poker',
  description:
    'A simple easy to use scrum poker app. Create a room, invite your team, and start estimating your user stories.',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isAuthed = await isAuthenticatedNextjs();

  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" suppressHydrationWarning>
        <ConvexClientProvider>
          <body className={`${inter.className} antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Toaster />
              {isAuthed ? <Header /> : null}
              {children}
            </ThemeProvider>
          </body>
        </ConvexClientProvider>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
