'use client';
import { CheckIcon, ClipboardCopyIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Button } from '@/src/components/ui/button';
import { showErrorToast } from '@/src/components/ui/sonner';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';
import type { RoomPageParameters } from '@/src/types/room';

export const ShareRoomDialog = () => {
  const parameters = useParams<RoomPageParameters>();
  const roomDetails = useRoomDetails();
  const [isCopied, setIsCopied] = useState(false);
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
    };
  }, []);

  const roomUrl = useMemo(() => {
    if (typeof window === 'undefined') {
      return '';
    }

    return parameters.code
      ? `${window.location.origin}${ROUTES.ROOM(parameters.code)}`
      : '';
  }, [parameters.code]);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(roomUrl);
      setIsCopied(true);

      if (timeoutReference.current) {
        clearTimeout(timeoutReference.current);
      }
      timeoutReference.current = setTimeout(() => {
        setIsCopied(false);
        timeoutReference.current = null;
      }, 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      showErrorToast('Failed to copy the room URL. Please try again.');
    }
  };

  if (!parameters.code || !roomDetails) {
    return null;
  }

  return (
    <Button
      variant='ghost'
      aria-label={`Copy room ${parameters.code} URL`}
      onClick={handleCopyUrl}
    >
      {isCopied ? (
        <CheckIcon className='stroke-green-600' />
      ) : (
        <ClipboardCopyIcon />
      )}
      Room {parameters.code}
    </Button>
  );
};
