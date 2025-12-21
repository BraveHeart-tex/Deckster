'use client';
import { Loader2 } from 'lucide-react';
import { redirect } from 'next/navigation';

import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { ROUTES } from '@/src/lib/routes';

export const JoiningRoomIndicator = () => {
  const onCancel = () => redirect(ROUTES.HOME);

  return (
    <div
      className='bg-background/90 fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm'
      role='alertdialog'
      aria-modal='true'
      aria-labelledby='joining-room-title'
      aria-describedby='joining-room-description'
    >
      <Card className='mx-4 w-full max-w-sm rounded-2xl shadow-xl'>
        <CardHeader className='flex flex-col items-center gap-2'>
          <Loader2
            className='text-primary h-12 w-12 animate-spin'
            aria-hidden='true'
          />
          <CardTitle
            id='joining-room-title'
            className='text-center text-xl font-semibold'
          >
            Joining Room...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p
            id='joining-room-description'
            className='text-muted-foreground mb-4 text-center'
          >
            Please wait while we connect you to your room. This might take a
            moment.
          </p>
          <Button
            variant='outline'
            className='w-full'
            onClick={onCancel}
            aria-label='Cancel joining room'
          >
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
