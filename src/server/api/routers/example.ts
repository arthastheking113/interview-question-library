//import { protectedProcedure } from './../trpc';
//import { type Example } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const exampleRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: protectedProcedure
  .input(z.object({ userId: z.string().optional() }).transform((o) => ({ userId: o.userId })))
  .query(async ({ input }) => {
    //await prisma.example.create({ data: { updatedAt: new Date()}});
    return await prisma.example.findMany({ 
      where: { 
        userId: { 
          equals: input?.userId
        }
      }
    });
    //return await prisma.$queryRaw<Example[]>`SELECT * FROM Example`;
  }),

  create: protectedProcedure
  .input(z.object({userId: z.string(), content: z.string()}))
  .mutation(async ({input}) => {
    await prisma.example.create({ data: { updatedAt: new Date(), userId: input.userId, content: input.content}});
  }),

  delete: protectedProcedure
  .input(z.object({id: z.string()}))
  .mutation(async ({input}) => {
    await prisma.example.delete({
      where: {
        id: input.id,
      }
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can see this secret message when you authenticated!";
  }),
});
