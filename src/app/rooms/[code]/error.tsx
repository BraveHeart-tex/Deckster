'use client';

import { AlertTriangle, Link } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import { ERROR_CODES } from '@/shared/errorCodes';
import { buttonVariants } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { ROUTES } from '@/src/lib/routes';
import { isApplicationError } from '@/src/misc/isApplicationError';

const RoomErrorPage = ({ error }: { error: Error & { digest?: string } }) => {
  useEffect(() => {
    if (isApplicationError(error)) {
      switch (error.data.code) {
        case ERROR_CODES.UNAUTHORIZED: {
          redirect(ROUTES.AUTH);
        }
        case ERROR_CODES.NOT_FOUND: {
          redirect(ROUTES.HOME);
        }
        default: {
          break;
        }
      }
    }
  }, [error]);

  if (isApplicationError(error)) {
    return null;
  }

  return (
    <div className="bg-muted flex h-full items-center justify-center px-4">
      <Card className="w-full max-w-md rounded-2xl shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="flex justify-center">
            <span className="bg-destructive/10 text-destructive rounded-full p-3">
              <AlertTriangle className="h-6 w-6" />
            </span>
          </div>
          <CardTitle className="text-2xl font-bold">
            An unexpected error occurred
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            We apologize for the inconvenience.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <span className="text-muted-foreground text-sm">{error.message}</span>
          <Link
            href={ROUTES.HOME}
            className={buttonVariants({
              variant: 'outline',
            })}
          >
            Go Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomErrorPage;
