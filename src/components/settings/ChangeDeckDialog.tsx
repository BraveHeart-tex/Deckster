import { useMutation } from 'convex/react';
import { AlertCircleIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import { api } from '@/convex/_generated/api';
import { areArraysEqualUnordered } from '@/shared/areArraysEqualUnordered';
import { ERROR_CODES } from '@/shared/errorCodes';
import ScrollablePresetButtons from '@/src/components/settings/ScrollablePresetButtons';
import { Alert, AlertDescription, AlertTitle } from '@/src/components/ui/alert';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/src/components/ui/dialog';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import {
  showErrorToast,
  showInfoToast,
  showSuccessToast,
} from '@/src/components/ui/sonner';
import { DECK_MAX_SIZE, DEFAULT_DECK } from '@/src/constants/vote.constants';
import { handleApplicationError } from '@/src/helpers/handleApplicationError';
import { useRoomDetails } from '@/src/hooks/useRoomDetails';
import { ROUTES } from '@/src/lib/routes';
import { CommonDialogProps } from '@/src/types/dialog';

const ChangeDeckDialog = ({ isOpen, onOpenChange }: CommonDialogProps) => {
  const roomDetails = useRoomDetails();
  const [draftDeck, setDraftDeck] = useState<string[]>(
    roomDetails?.roomSettings?.deck || DEFAULT_DECK
  );

  const [isSaving, setIsSaving] = useState(false);
  const updateDeck = useMutation(api.roomSettings.updateRoomDeck);
  const router = useRouter();

  const errorMessage = useMemo(() => {
    const trimmedDeck = draftDeck.map((card) => card.trim());
    const uniqueCards = new Set(trimmedDeck);

    if (trimmedDeck.length === 0) {
      return 'Deck cannot be empty';
    }

    if (trimmedDeck.some((card) => card.length === 0)) {
      return 'Deck cannot contain empty or whitespace-only entries';
    }

    if (uniqueCards.size !== trimmedDeck.length) {
      return 'Deck cannot have duplicate values';
    }

    if (trimmedDeck.length === 1) {
      return 'Deck must have at least two options';
    }

    if (trimmedDeck.length > DECK_MAX_SIZE) {
      return `Deck cannot have more than ${DECK_MAX_SIZE} options`;
    }

    return '';
  }, [draftDeck]);

  const handleDeckChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDraftDeck(event.target.value.split(','));
  };

  const handleSaveDeck = async () => {
    if (!roomDetails || !roomDetails.roomSettings) {
      return;
    }

    if (
      roomDetails.roomSettings?.deck &&
      areArraysEqualUnordered(draftDeck, roomDetails.roomSettings?.deck)
    ) {
      onOpenChange(false);
      showInfoToast('Deck has not changed');
      return;
    }

    setIsSaving(true);
    try {
      await updateDeck({
        roomId: roomDetails.room._id,
        roomSettingId: roomDetails.roomSettings._id,
        newDeck: draftDeck,
      });
      showSuccessToast('Deck updated successfully');
      onOpenChange(false);
    } catch (error) {
      handleApplicationError(error, {
        [ERROR_CODES.UNAUTHORIZED]: () => {
          showErrorToast('You are not authorized to perform this action.');
          router.push(ROUTES.AUTH);
        },
        [ERROR_CODES.NOT_FOUND]: () => {
          showErrorToast('Room not found');
          router.push(ROUTES.HOME);
        },
        [ERROR_CODES.FORBIDDEN]: () => {
          showErrorToast(
            'You do not have permission to update the room settings'
          );
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeckSelect = (newDeck: string[]) => {
    if (areArraysEqualUnordered(newDeck, draftDeck)) {
      return;
    }

    setDraftDeck(newDeck);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Point Deck</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            <p>
              When you change the point deck, any existing votes will be
              removed.
            </p>
          </AlertDescription>
        </Alert>
        <div className="space-y-4 overflow-auto">
          <div className="w-full overflow-auto">
            <ScrollablePresetButtons onDeckSelect={handleDeckSelect} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="deck">Deck</Label>
            <Input
              type="text"
              id="deck"
              placeholder="Comma-separated list of options (e.g. '1, 3, 5')"
              value={draftDeck.join(',')}
              onChange={handleDeckChange}
            />
            <p
              className="text-destructive mt-1 min-h-[1rem] text-xs"
              aria-live="polite"
              aria-atomic="true"
            >
              {errorMessage || '\u00A0' /* non-breaking space to keep height */}
            </p>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button
            disabled={!!errorMessage}
            isLoading={isSaving}
            onClick={handleSaveDeck}
          >
            {isSaving ? 'Saving' : 'Save'} Deck
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeDeckDialog;
