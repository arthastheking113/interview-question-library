
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const positionRouter = createTRPCRouter({

    getAllPositions: protectedProcedure
    .query(async ({ input }) => {
        return await prisma.position.findMany({
            select:{
                id: true,
                title: true
            }
        });
    }),

    getPositions: protectedProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ input }) => {
        return await prisma.position.findMany({
            where: {
                userId: input.userId
            },
            select:{
                id: true,
                title: true
            }
        });
    }),

    getPositionDetails: protectedProcedure
    .input(z.object({ id: z.string()}))
    .query(async ({ input }) => {
        return await prisma.position.findUnique({
            where:{
                id: input.id
            },
            include: {
                positionContent: true,
                positionQuestion: {
                    select:{
                        id: true,
                        question: {
                            include:{
                                questionContent: true,
                                tags: {
                                    include: {
                                        tag: true
                                    }
                                }
                            }
                        }
                    }

                }
            },
        })
    }),

    update: protectedProcedure
    .input(z.object({id: z.string(), title: z.string(), description: z.string()}))
    .mutation(async ({input}) => {
        await prisma.position.update({
            where: {
              id: input.id,
            },
            data: {
                title: input.title
            },
          })

        await prisma.positionContent.update({
            where:{
                positionId: input.id
            },
            data:{
                description: input.description
            }
        })
    }),

    create: protectedProcedure
    .input(z.object({userId: z.string(), title: z.string(), description: z.string()}))
    .mutation(async ({input}) => {
        const result = await prisma.position.create({ data: { title: input.title, userId: input.userId }});

        await prisma.positionContent.create({data: { description: input.description, positionId: result.id }});

        return result;
    }),

    delete: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {

        await prisma.positionQuestion.deleteMany({
            where: {
                positionId: input.id
            }
        });
        await prisma.positionContent.delete({
            where: {
                positionId: input.id,
            }
        });

        await prisma.position.delete({
            where: {
                id: input.id,
            }
        });

        
    }),

});
