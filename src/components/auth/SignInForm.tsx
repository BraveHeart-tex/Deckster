'use client';
import FormField from '@/src/components/common/FormField';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { ROUTES } from '@/src/constants/routes';
import { useAuthActions } from '@convex-dev/auth/react';
import { GalleryVerticalEnd } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { toast } from 'sonner';

const SignInForm = () => {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<'signIn' | 'signUp'>('signIn');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      formData.set('flow', flow);
      formData.set('redirectTo', ROUTES.HOME);

      await signIn('password', formData);
    } catch (error) {
      let toastTitle = 'Unknown error occurred';
      if (error instanceof Error) {
        if (error.message.includes('Invalid secret')) {
          toastTitle = 'Invalid secret. Please try again.';
        } else {
          toastTitle =
            flow === 'signIn'
              ? 'Could not sign in, did you mean to sign up?'
              : 'Could not sign up, did you mean to sign in?';
        }
      }
      toast.error(toastTitle);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col items-center gap-2 font-medium">
          <div className="flex size-8 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-6" />
          </div>
          <span className="sr-only">Simple Scrum Poker.</span>
        </div>
        <h1 className="text-xl font-bold">Welcome to Simple Scrum Poker</h1>
        <div className="text-center text-sm">
          {flow === 'signIn'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <Button
            type="button"
            variant="link"
            className="p-0"
            onClick={() => setFlow(flow === 'signIn' ? 'signUp' : 'signIn')}
          >
            {flow === 'signIn' ? 'Sign up instead' : 'Sign in instead'}
          </Button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField>
          <Label htmlFor="email">Email</Label>
          <Input type="email" name="email" placeholder="Email" required />
        </FormField>
        <FormField>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
          />
        </FormField>
        <Button type="submit" disabled={submitting} className="w-full">
          {flow === 'signIn' ? 'Sign in' : 'Sign up'}
        </Button>
      </form>
      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          Or
        </span>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          typeof="button"
          variant="outline"
          type="button"
          className="w-full"
          onClick={() => void signIn('google')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
              d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
              fill="currentColor"
            />
          </svg>
          Continue with Google
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => void signIn('anonymous')}
        >
          Sign in anonymously
        </Button>
      </div>
    </div>
  );
};

export default SignInForm;
