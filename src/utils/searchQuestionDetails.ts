import { Question, QuestionContent, QuestionTag, Tag } from "@prisma/client";

export type SearchQuestionDetails = (Question & {
    questionContent: QuestionContent | null;
    tags: (QuestionTag & {
        tag: Tag;
    })[];
});