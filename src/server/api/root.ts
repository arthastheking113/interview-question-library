import { tagRouter } from '~/server/api/routers/tag';
import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "~/server/api/routers/user";
import { questionRouter } from '~/server/api/routers/question';
import { positionRouter } from './routers/potision';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  tag: tagRouter,
  question: questionRouter,
  position: positionRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
