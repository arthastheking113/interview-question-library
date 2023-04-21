import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";

const YourPositions: NextPage = () => {
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const { data: questions} = api.position.getPositions.useQuery({ userId: sessionData?.user.id as string });
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
                <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold my-2 py-2 px-4 rounded-full" href="/questions/create">
                  Create new position
                </Link>
                <h4 className="text-4xl">Your positions:</h4>
              </>
            )
          }
        })()}
        
        {questions?.map(function(item, i){
          return (
          <p className="text-lg" key={i}>
            {item.title} <span className="text-blue-400 cursor-pointer"><Link href={`/questions/edit/${item.id}`}> - edit - </Link></span> 
            <span onClick={() => removeQuestion(item.id)} className="text-red-400 cursor-pointer">x</span>
          </p>
          )
        })}
      </div>
      
    </>
    
  );
};

export default YourPositions;