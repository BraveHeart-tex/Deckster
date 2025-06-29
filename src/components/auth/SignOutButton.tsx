'use client';
import { Button } from '@/src/components/ui/button';
import { useAuthActions } from '@convex-dev/auth/react';
import { useConvexAuth } from 'convex/react';

const SignOutButton = () => {
  const { isAuthenticated } = useConvexAuth();
  const { signOut } = useAuthActions();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Button variant="ghost" onClick={() => void signOut()}>
      Sign out
    </Button>
  );
};

export default SignOutButton;
