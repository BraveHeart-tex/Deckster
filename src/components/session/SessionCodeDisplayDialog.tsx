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
import { CheckIcon, ClipboardCopyIcon } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useEffect, useRef, useState } from 'react';

const mockUrl = 'https://example.com/session/12345';
const mockRoomName = 'Room 82253004';

const SessionCodeDisplayDialog = () => {
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
      await navigator.clipboard.writeText(mockUrl);
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
      showErrorToast('Failed to copy the session URL. Please try again.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Session Code & QR</DialogTitle>
          <DialogDescription>
            Share this code or let teammates scan the QR code to join instantly.
            Tap the copy icon to copy the code with one click.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <p>{mockRoomName}</p>
          <QRCodeSVG value={mockUrl} size={225} />
          <div className="flex items-center gap-2">
            <span className="text-foreground">{mockUrl}</span>
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

export default SessionCodeDisplayDialog;
