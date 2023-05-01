
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const answerRouter = createTRPCRouter({

    getAnswer: protectedProcedure
    .input(z.object({questionId: z.string()}))
    .query(async ({input}) => {
        return await prisma.answer.findMany({
            where: {
                questionId: input.questionId
            }
        });
    }),


    update: protectedProcedure
    .input(z.object({id: z.string(), title: z.string(), content: z.string()}))
    .mutation(async ({input}) => {

        if(input.content == null) input.content = "";
        if(!input.content) input.content = "";
        
        
        await prisma.answer.update({
            where: {
              id: input.id,
            },
            data: {
                content: input.content
            },
          })
    }),

    create: protectedProcedure
    .input(z.object({userId: z.string(), questionId: z.string(), content: z.string()}))
    .mutation(async ({input}) => {

        if(input.content == null) input.content = "";
        if(!input.content) input.content = "";

        const result = await prisma.answer.create({ data: { content: input.content, questionId: input.questionId, userId: input.userId }});

        return result;
    }),

    delete: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {

        await prisma.answer.delete({
            where: {
                id: input.id
            }
        });

        
    }),

});
