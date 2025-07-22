'use client';

import { CheckIcon, PaletteIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import ThemeToggle from '@/src/components/ThemeToggle';
import { Button } from '@/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/src/components/ui/dropdown-menu';
import { cn } from '@/src/lib/utils';

const baseThemeOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Bubblegum', value: 'bubblegum' },
  { label: 'Lumenchroma', value: 'lumenchroma' },
  { label: 'Slack', value: 'slack' },
  { label: 'Velvet', value: 'velvet' },
];

const ModeToggle = ({ initialTheme }: { initialTheme: string }) => {
  const [baseTheme, setBaseTheme] = useState<string>(initialTheme);

  useEffect(() => {
    const htmlElement = document.documentElement;
    // Remove all base theme classes first to ensure only one is active
    baseThemeOptions.forEach((option) => {
      if (option.value !== 'default') {
        htmlElement.classList.remove(option.value);
      }
    });
    if (baseTheme !== 'default') {
      htmlElement.classList.add(baseTheme);
    }
    document.cookie = `base-theme=${baseTheme}; path=/`;
    localStorage.setItem('base-theme', baseTheme);
  }, [baseTheme]);

  const handleBaseThemeChange = (value: string) => () => {
    setBaseTheme(value);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" variant="outline">
            <PaletteIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Base App Theme</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {baseThemeOptions.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={handleBaseThemeChange(option.value)}
              className={cn(
                option.value === baseTheme &&
                  'bg-accent text-accent-foreground font-semibold'
              )}
            >
              {option.label}
              {option.value === baseTheme && <CheckIcon className="ml-auto" />}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ThemeToggle />
    </>
  );
};

export default ModeToggle;
