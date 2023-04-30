import { Question, QuestionContent, QuestionTag, Tag } from "@prisma/client";

export type PositionQuestionDetails = { 
    id: string
    question: Question & { questionContent: QuestionContent | null; 
    tags: (QuestionTag & { 
    tag: Tag; 
    })[]; 
}; 
}