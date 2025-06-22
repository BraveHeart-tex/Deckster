'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import type React from 'react';

const ThemeProvider = ({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
};

export default ThemeProvider;
