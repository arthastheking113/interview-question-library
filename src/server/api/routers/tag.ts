import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";

export const tagRouter = createTRPCRouter({

    getRandomTags: protectedProcedure
    .input(z.object({ amount: z.number()}))
    .query(async ({ input }) => {
        return await prisma.tag.findMany({ 
            take: input.amount
        });
    }),

    getTags: protectedProcedure
    .query(async () => {
        return await prisma.tag.findMany({});
    }),

    isTagExist: protectedProcedure
    .input(z.object({ text: z.string()}))
    .query(async ({ input }) => {
        const count = await prisma.tag.count({
            where:{
                name: input.text.toLowerCase().trim()
            }
        });
        
        if(count == 0) return true;

        return false;
    }),

    searchTags: protectedProcedure
    .input(z.object({ text: z.string()}))
    .query(async ({ input }) => {

        if(input?.text == ""){
            return await prisma.tag.findMany({ 
                take: 5
            });
        }

        return await prisma.tag.findMany({ 
            where: { 
                name: { 
                    contains: input?.text
                }
            }
        });
    }),

    create: protectedProcedure
    .input(z.object({userId: z.string(), name: z.string()}))
    .mutation(async ({input}) => {
        input.name = input.name.toLowerCase().replace(" ", "-");
        await prisma.tag.create({ data: { name: input.name}});
    }),

    delete: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {
        await prisma.questionTag.deleteMany({
            where:{
                tagId: input.id
            }
        });
        await prisma.tag.delete({
            where: {
                id: input.id,
            }
        });
    }),

});
