'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { showErrorToast } from '@/components/ui/sonner';
import { MOCK_ROOM_CODE, MOCK_ROOM_URL } from '@/constants/room.constants';
import { CheckIcon, ClipboardCopyIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

const RoomCodeDisplayDialog = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isCopied, setIsCopied] = useState(false);
  const timeoutReference = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutReference.current) clearTimeout(timeoutReference.current);
    };
  }, []);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(MOCK_ROOM_URL);
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Room Code</DialogTitle>
          <DialogDescription>
            Share this code or let teammates scan the QR code to join instantly.
            Tap the copy icon to copy the code with one click.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <p>{MOCK_ROOM_CODE}</p>
          <QRCodeSVG value={MOCK_ROOM_URL} size={225} />
          <div className="flex items-center gap-2">
            <span className="text-foreground">{MOCK_ROOM_URL}</span>
            <Button size="icon" variant="outline" onClick={handleCopyUrl}>
              {isCopied ? (
                <CheckIcon className="stroke-green-600" />
              ) : (
                <ClipboardCopyIcon />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoomCodeDisplayDialog;
