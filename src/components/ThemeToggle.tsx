'use client';

import * as SwitchPrimitives from '@radix-ui/react-switch';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from '@/src/lib/utils';

export const ThemeToggle = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!mounted) {
    return null;
  }

  const isChecked = theme === 'dark';

  return (
    <SwitchPrimitives.Root
      checked={isChecked}
      onClick={handleThemeToggle}
      className={cn(
        'peer focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-accent data-[state=unchecked]:bg-input inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50'
      )}
    >
      <SwitchPrimitives.Thumb
        className={cn(
          'bg-background pointer-events-none flex h-5 w-5 items-center justify-center rounded-full shadow-lg ring-0 transition-transform',
          'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
        )}
      >
        {isChecked ? <Moon className='size-3' /> : <Sun className='size-3' />}
      </SwitchPrimitives.Thumb>
    </SwitchPrimitives.Root>
  );
};
