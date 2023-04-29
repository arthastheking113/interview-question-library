import { Question, QuestionContent, QuestionTag, Tag } from "@prisma/client";

export type PositionQuestionDetails = { 
    question: Question & { questionContent: QuestionContent | null; 
    tags: (QuestionTag & { 
    tag: Tag; 
    })[]; 
}; 
}