import Google from '@auth/core/providers/google';
import { Password } from '@convex-dev/auth/providers/Password';
import { convexAuth, getAuthUserId } from '@convex-dev/auth/server';
import { query } from './_generated/server';

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password, Google],
});

export const loggedInUser = query({
  handler: async (context) => {
    const userId = await getAuthUserId(context);
    if (!userId) {
      return null;
    }
    const user = await context.db.get(userId);
    if (!user) {
      return null;
    }
    return user;
  },
});
