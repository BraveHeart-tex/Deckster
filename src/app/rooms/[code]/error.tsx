'use client';

import { AlertTriangle, HomeIcon } from 'lucide-react';
import Link from 'next/link';

import { buttonVariants } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { ROUTES } from '@/src/lib/routes';

const RoomErrorPage = ({ error }: { error: Error & { digest?: string } }) => {
  return (
    <div className="flex h-full items-center justify-center px-4">
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
            <HomeIcon />
            Go Home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoomErrorPage;
