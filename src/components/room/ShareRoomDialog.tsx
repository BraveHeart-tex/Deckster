'use client';
import { CheckIcon, ClipboardCopyIcon, Share2Icon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { Badge } from '@/src/components/ui/badge';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import { showErrorToast } from '@/src/components/ui/sonner';
import { ROUTES } from '@/src/lib/routes';
import { RoomPageParameters } from '@/src/types/room';

// TODO: Will refactor this to a server component
const ShareRoomDialog = () => {
  const parameters = useParams<RoomPageParameters>();
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

  if (!parameters.code) {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <Share2Icon />
          Room {parameters.code}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Room</DialogTitle>
          <DialogDescription>
            Share this room code or let teammates scan the QR to join instantly.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <Badge>{parameters.code}</Badge>
          <div className="bg-muted/50 flex flex-col items-center rounded-lg p-4">
            <QRCodeSVG value={roomUrl} size={225} />
            <p className="text-muted-foreground mt-2 text-sm">
              Scan to join this room
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full max-w-xs justify-between font-mono"
              onClick={handleCopyUrl}
            >
              <span className="truncate">{roomUrl}</span>
              {isCopied ? (
                <CheckIcon className="ml-2 h-4 w-4 stroke-green-600" />
              ) : (
                <ClipboardCopyIcon className="ml-2 h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ShareRoomDialog;
