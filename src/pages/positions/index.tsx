import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";

const Position: NextPage = () => {
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const { data: questions} = api.position.getAllPositions.useQuery();
  const ctx = api.useContext();


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
              </>
            )
          }
        })()}
        
        {questions?.map(function(item, i){
          return (
          <p className="text-lg" key={i}>
            {item.title} <span className="text-blue-400 cursor-pointer"><Link href={`/questions/edit/${item.id}`}> View </Link></span> 
          </p>
          )
        })}
      </div>
      
    </>
    
  );
};

export default Position;