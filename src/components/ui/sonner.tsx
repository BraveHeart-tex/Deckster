'use client';

import { useTheme } from 'next-themes';
import {
  type ExternalToast,
  Toaster as Sonner,
  type ToasterProps,
  toast,
} from 'sonner';

const Toaster = ({ ...properties }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className='toaster group'
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto',
          description: 'group-[.toast]:text-muted-foreground',
        },
      }}
      richColors
      closeButton
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': 'var(--border)',
        } as React.CSSProperties
      }
      {...properties}
    />
  );
};

const showSuccessToast = (
  message: string,
  options?: ExternalToast
): string | number => {
  return toast.success(message, options);
};

const showErrorToast = (
  message: string,
  options?: ExternalToast
): string | number => {
  return toast.error(message, options);
};

const showInfoToast = (
  message: string,
  options?: ExternalToast
): string | number => {
  return toast.info(message, options);
};

export { showErrorToast, showInfoToast, showSuccessToast, Toaster };
