'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from 'convex/react';
import { PencilIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { api } from '@/convex/_generated/api';
import type { Id } from '@/convex/_generated/dataModel';
import { DOMAIN_ERROR_CODES } from '@/shared/domainErrorCodes';
import { Button } from '@/src/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/src/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { showErrorToast, showSuccessToast } from '@/src/components/ui/sonner';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/src/components/ui/tooltip';
import { handleDomainError } from '@/src/helpers/handleDomainError';
import { ROUTES } from '@/src/lib/routes';
import {
  type ChangeDisplayNameInput,
  changeDisplayNameSchema,
} from '@/src/validation/change-display-name.schema';

interface ChangeDisplaynameDialogProps {
  defaultValue: string;
  participantId: Id<'participants'>;
}

const ChangeDisplaynameDialog = ({
  defaultValue,
  participantId,
}: ChangeDisplaynameDialogProps) => {
  const [isChanging, setIsChanging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const form = useForm<ChangeDisplayNameInput>({
    defaultValues: {
      userDisplayName: defaultValue,
    },
    resolver: zodResolver(changeDisplayNameSchema),
  });
  const changeDisplayName = useMutation(api.participants.changeDisplayName);
  const router = useRouter();

  const handleOpenChange = (isOpen: boolean) => {
    setIsOpen(isOpen);
    if (!isOpen) {
      form.reset({ userDisplayName: defaultValue });
    }
  };

  const onSubmit = async (data: ChangeDisplayNameInput) => {
    setIsChanging(true);
    try {
      await changeDisplayName({
        displayName: data.userDisplayName,
        participantId,
      });
      showSuccessToast('Display name changed successfully!');
      setIsOpen(false);
    } catch (error) {
      handleDomainError(error, {
        [DOMAIN_ERROR_CODES.AUTH.UNAUTHORIZED]: (error) => {
          showErrorToast(error.message);
          router.push(ROUTES.SIGN_IN);
        },
      });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Tooltip>
          <TooltipTrigger asChild onClick={() => setIsOpen(true)}>
            <Button
              size='icon'
              variant='outline'
              className='ml-2 transition-opacity duration-200 lg:opacity-0 lg:group-hover:opacity-100'
            >
              <PencilIcon />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Change your display name</p>
          </TooltipContent>
        </Tooltip>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change your display name</DialogTitle>
          <DialogDescription>
            Use the form below to change your display name in this room.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='userDisplayName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-2 justify-end'>
              <DialogClose asChild>
                <Button type='button' variant='outline' disabled={isChanging}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                type='submit'
                disabled={
                  isChanging || defaultValue === form.watch('userDisplayName')
                }
                isLoading={isChanging}
              >
                {isChanging ? 'Saving' : 'Save'} changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeDisplaynameDialog;
