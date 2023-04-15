import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";

const QuestionsEdit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const { data: question} = api.question.getQuestionDetails.useQuery({ id: id as string });
  const ctx = api.useContext();

  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      void ctx.question.getQuestions.invalidate({userId: sessionData?.user?.id as string});
    }
  })


  const removeQuestion = (id: string) => {
    deleteQuestion.mutate({id: id});
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
                <h4 className="text-4xl">Edit question</h4>

                <h4 className="text-4xl">{question?.title}</h4>

                <>{question?.questionContent?.content}</>
              </>
            )
          }
        })()}
        
        <h4 className="text-4xl">Add answer</h4>
        

      </div>
    </>
    
  );
};


export default QuestionsEdit;