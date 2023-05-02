import { Question, QuestionContent } from "@prisma/client";
import { z } from "zod";

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { prisma } from "~/server/db";
import { PositionQuestionDetails } from "~/utils/PositionQuestionsDetails";
import { SearchQuestionDetails } from "~/utils/searchQuestionDetails";


export const questionRouter = createTRPCRouter({


    getQuestions: protectedProcedure
    .input(z.object({ userId: z.string()}))
    .query(async ({ input }) => {
        return await prisma.question.findMany({ 
            where: { 
                userId: { 
                    equals: input?.userId
                }
            }
        });
    }),

    getQuestionDetails: protectedProcedure
    .input(z.object({ id: z.string()}))
    .query(async ({ input }) => {
        return await prisma.question.findUnique({
            where:{
                id: input.id
            },
            include: {
                questionContent: true,
                tags: {
                    include:{
                        tag: true
                    }
                },
                answer: true
            },
        })
    }),

    searchQuestions: protectedProcedure
    .input(z.object({ text: z.string(), tagId: z.array(z.string()), pageIndex: z.number(), pageSize: z.number()}))
    .query(async ({ input }) => {
        
        if(input.text == null) input.text = "   asdasdqweqwzxcz asd as qw eqc zxczx    qe  ";
        if(!input.text) input.text = "   asdasdqweqwzxcz asd as qw eqc zxczx    qe  ";
        
        const question: SearchQuestionDetails[] =  await prisma.question.findMany({ 
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
                            some: {
                                tag: {
                                    name:{
                                        in: input.tagId
                                    }
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
            },
            include:{
                tags: {
                    include: {
                        tag: true
                    }
                },
                questionContent: true
            }
        });

        const count = await prisma.question.count({ 
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
                                tagId: {
                                    in: input.tagId
                                }
                            }
                        }
                    }
                ]
                
            }
        });
        // (Question & {
        //     questionContent: QuestionContent | null;
        //     tags: (QuestionTag & {
        //         tag: Tag;
        //     })[];
        // })[]
        
        return { question, total: count }
    }),

    create: protectedProcedure
    .input(z.object({userId: z.string(), title: z.string(), content: z.string(), tagsId: z.string().array()}))
    .mutation(async ({input}) => {
        const result = await prisma.question.create({ data: { userId: input.userId, title: input.title}});

        if(input.content == null) input.content = "";
        if(!input.content) input.content = "";
        
        await prisma.questionContent.create({ data: { content: input.content, questionId: result.id }});

        const tagData = input.tagsId.map((tagId) => ({
            questionId: result.id, 
            tagId: tagId
        }));
        console.log(tagData);
        await prisma.questionTag.createMany({ data: tagData});
        
        return result;
    }),

    
    update: protectedProcedure
    .input(z.object({id: z.string(), title: z.string(), content: z.string(), tagsId: z.string().array()}))
    .mutation(async ({input}) => {
        await prisma.question.update({ 
            where:{
                id: input.id
            },
            data: { title: input.title}
        });

        if(input.content == null) input.content = "";
        if(!input.content) input.content = "";
        
        await prisma.questionContent.update({ 
            where:{
                questionId: input.id
            },
            data: { content: input.content }
        });

        await prisma.questionTag.deleteMany({
            where: {
                questionId: input.id,
            }
        });

        for (let i = 0; i < input.tagsId.length; i++) {
            const value = input.tagsId[i];
            await prisma.questionTag.create({ data: { questionId: input.id, tagId: value as string }});
        }

    }),
    


    delete: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {

        await prisma.answer.deleteMany({
            where: {
                questionId: input.id
            }
        });

        await prisma.questionTag.deleteMany({
            where: {
                questionId: input.id
            }
        });

        await prisma.questionContent.deleteMany({
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


    addQuestionPosition: protectedProcedure
    .input(z.object({positionId: z.string(), questionId: z.string()}))
    .mutation(async ({input}) => {

        const result = await prisma.positionQuestion.create({data: { positionId: input.positionId, questionId: input.questionId, sortOrder: 0}});
        
        return result;
    }),

    removeQuestionPosition: protectedProcedure
    .input(z.object({id: z.string()}))
    .mutation(async ({input}) => {
        await prisma.positionQuestion.delete({
            where:{
                id: input.id
            }
        })
    }),
});
