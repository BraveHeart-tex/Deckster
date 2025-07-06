import z from 'zod';

import { userDisplayNameSchema } from '@/src/validation/common.validation';

export const changeDisplayNameSchema = z.object({
  userDisplayName: userDisplayNameSchema,
});

export type ChangeDisplayNameInput = z.infer<typeof changeDisplayNameSchema>;
