import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { PositionContent, PositionQuestion, Question, QuestionContent, QuestionTag, Tag } from "@prisma/client";
import { PositionQuestionDetails } from "~/utils/PositionQuestionsDetails";
import { SearchQuestionDetails } from "~/utils/searchQuestionDetails";
import { MDEditor } from "~/components/markdownEditor";
import { ViewMarkDown } from "~/components/viewMarkDown";
import { AnswersModal } from "~/components/answerModal";

const PositionView: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});

  
  const [existingQuestions, setExistingQuestions] = useState<PositionQuestionDetails[]>([]);
  
  const { data: position} = api.position.getPositionDetails.useQuery({ id: id as string });
  const ctx = api.useContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  
  useEffect(() => {
    setTitle(position?.title as string);
    setContent(position?.positionContent?.description as string);
    if (position?.positionQuestion){
      setExistingQuestions(position?.positionQuestion as PositionQuestionDetails[]);
    }
  });
  
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
              <div className="w-full">
                <div className=" shadow-sm -space-y-px text-right">
                  <div>
                    <Link
                     href={`/positions/edit/${id as string}`}  
                     className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                      Edit this position
                     </Link>
                  </div>
                </div>
                <div className=" shadow-sm -space-y-px">
                  <div>
                    <h4 className="text-4xl">{title}</h4>
                  </div>
                </div>
                <div className=" shadow-sm -space-y-px mt-6">
                  <div>
                    <ViewMarkDown value={content}/>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 w-full">
                
                <div>
                  <h4 className="text-4xl mb-4">
                    Questions
                  </h4>
                  {existingQuestions?.map(function(item, i){
                    return (
                    <div key={i} className="mb-4">
                      
                      <div>
                        {i + 1}/ {item.question.title}
                      </div>
                      <div>
                        <ViewMarkDown value={item.question.questionContent?.content as string} ></ViewMarkDown>
                      </div>
                      
                      <AnswersModal questionId={item.question.id} />

                    </div>
                    )
                  })}

                </div>
              </div>
                
              </>
            )
          }
        })()}
        

      </div>
    </>
    
  );
};


export default PositionView;