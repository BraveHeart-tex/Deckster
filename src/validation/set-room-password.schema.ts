import z from 'zod';

export const setRoomPasswordSchema = z
  .object({
    roomPassword: z.string().min(1, { message: 'Password is required.' }),
    roomPasswordAgain: z
      .string()
      .min(1, { message: 'Please confirm your password.' }),
  })
  .superRefine((data, ctx) => {
    if (data.roomPassword !== data.roomPasswordAgain) {
      ctx.addIssue({
        path: ['roomPasswordAgain'],
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match.',
      });
    }
  });

export type SetRoomPasswordInput = z.infer<typeof setRoomPasswordSchema>;
