import { z } from "zod";
import { Option } from "~/utils/selectOptions";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { Tag } from "@prisma/client";

export const tagRouter = createTRPCRouter({

    getTagDropdown: protectedProcedure
    .query(async () => {
        const tags =  await prisma.tag.findMany({ });
        const options: Option[] = [];
        for (let index = 0; index < tags.length; index++) {
            const tag = tags[index] as Tag;
            options.push({ label: tag.name, value: tag.id });
        }
        console.log(options);
        return options;
    }),

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
