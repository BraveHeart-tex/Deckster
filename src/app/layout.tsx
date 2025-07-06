import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from 'next-themes';

import Header from '@/src/components/common/Header';
import { ConvexClientProvider } from '@/src/components/ConvexClientProvider';
import { Toaster } from '@/src/components/ui/sonner';

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
  const authResult = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <ClerkProvider>
        <ConvexClientProvider>
          <body className={`${inter.className} antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <Toaster />
              {authResult.isAuthenticated ? <Header /> : null}
              {children}
            </ThemeProvider>
          </body>
        </ConvexClientProvider>
      </ClerkProvider>
    </html>
  );
}
