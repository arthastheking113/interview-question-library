import { PositionContent } from '@prisma/client';

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

    searchPositions: protectedProcedure
    .input(z.object({ text: z.string()}))
    .query(async ({ input }) => {

        if(input.text == null) input.text = "        ";
        if(!input.text) input.text = "               ";

        return await prisma.position.findMany({
            where:{
                OR:[
                    {
                        title:{
                            contains: input.text
                        }
                    },
                    {
                        positionContent:{
                            description:{
                                contains: input.text
                            }
                        }
                    }
                ]
            },
            select:{
                id: true,
                title: true,
                positionContent:{
                    select:{
                        description: true
                    }
                }
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

        if(input.description == null) input.description = "";
        if(!input.description) input.description = "";
          
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

        if(input.description == null) input.description = "";
        if(!input.description) input.description = "";
        

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
        await prisma.positionContent.deleteMany({
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
