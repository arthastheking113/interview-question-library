import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";

const QuestionsCreate: NextPage = () => {
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const { data: questions} = api.question.getQuestions.useQuery({ userId: sessionData?.user.id as string });
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
                <h4 className="text-4xl">Create new question</h4>
              </>
            )
          }
        })()}
        

      </div>
    </>
    
  );
};

export default QuestionsCreate;