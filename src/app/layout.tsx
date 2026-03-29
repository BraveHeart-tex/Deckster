import './globals.css';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import { ThemeProvider } from 'next-themes';

import { APP_NAME } from '@/constants';
import { ConvexClientProvider } from '@/src/components/ConvexClientProvider';
import { Header } from '@/src/components/common/Header';
import { ModalHost } from '@/src/components/common/ModalHost';
import { GuestSessionProvider } from '@/src/components/GuestSessionProvider';
import { Toaster } from '@/src/components/ui/sonner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: `${APP_NAME} | Agile Scrum Poker Estimation Tool for Efficient Sprint Planning`,
  description: `${APP_NAME} is a powerful and intuitive Scrum poker app designed to streamline agile sprint planning and improve team collaboration. Estimate story points quickly using virtual cards, foster transparent communication, and accelerate decision-making. Perfect for agile teams seeking a seamless, fun, and efficient way to conduct Scrum poker sessions online. Boost your sprint velocity with ${APP_NAME} today!`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultTheme = cookieStore.get('base-theme')?.value || '';

  return (
    <html lang='en' suppressHydrationWarning className={defaultTheme}>
      <body className={`${inter.className} antialiased`}>
        <GuestSessionProvider>
          <ConvexClientProvider>
            <ThemeProvider
              attribute='class'
              enableSystem
              defaultTheme={defaultTheme || 'system'}
            >
              <div className='flex min-h-screen flex-col'>
                <Header />
                <main className='flex flex-1 pt-14'>
                  <div className='container mx-auto px-4 py-8 md:px-6'>
                    {children}
                  </div>
                </main>
              </div>
              <Toaster />
              <ModalHost />
            </ThemeProvider>
          </ConvexClientProvider>
        </GuestSessionProvider>
      </body>
    </html>
  );
}
