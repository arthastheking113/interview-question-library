import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const questionRouter = createTRPCRouter({


    getQuestions: protectedProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ input }) => {
    return await prisma.tag.findMany({ 
        where: { 
            userId: { 
                equals: input?.userId
            }
        }
        });
    }),

    searchQuestions: protectedProcedure
    .input(z.object({ text: z.string(), tagId: z.array(z.string()), pageIndex: z.number(), pageSize: z.number()}))
    .query(async ({ input }) => {

        return await prisma.question.findMany({ 
            where: { 
                OR:[
                    {
                        title: { 
                            contains: input?.text
                        }
                    },
                    {
                        questionContent:{
                            content:{
                                contains: input?.text
                            }
                        }
                    },
                    {
                        tags:{
                            every: {
                                id: {
                                    in: input.tagId
                                }
                            }
                        }
                    }
                ]
                
            },
            skip: input.pageSize * input.pageIndex,
            take: input.pageSize,
            orderBy:{
                updatedAt: "desc"
            }
        });
    }),

    create: protectedProcedure
    .input(z.object({userId: z.string(), title: z.string(), content: z.string()}))
    .mutation(async ({input}) => {
        const result = await prisma.question.create({ data: { userId: input.userId, title: input.title}});

        await prisma.questionContent.create({ data: { content: input.content, questionId: result.id }});
    }),

    delete: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {

        await prisma.questionContent.delete({
            where: {
                questionId: input.id
            }
        });

        await prisma.question.delete({
            where: {
                id: input.id,
            }
        });

        
    }),

});
