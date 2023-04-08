import { User, type Example } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const userRouter = createTRPCRouter({

  getAll: protectedProcedure.query(async () => {
    return await prisma.user.findMany();
  }),

  update: protectedProcedure
  .input(z.object(
  { 
    userId: z.string(),
    role: z.string() 
  }))
  .mutation(async ({ input }) => {
    
    await prisma.user.update({
      where: {
        id: input.userId,
      },
      data: {
        role: input.role,
      },
    })
  })
});
