import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from "react";
import { HomeNavigation } from "~/components/homeNavigation";


const Tags: NextPage = () => {
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const [name, setContent] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(0);
  
  const { data: questions} = api.question.searchQuestions.useQuery({ text: "", tagId: [],  pageIndex: pageIndex, pageSize: pageSize });
  const ctx = api.useContext();

  const createTag = api.question.create.useMutation({
    onSuccess: () => {
      setContent("");
      void ctx.tag.getTags.invalidate({userId: sessionData?.user?.id});
    }
  });

  const deleteTodo = api.tag.delete.useMutation({
    onSuccess: () => {
        void ctx.tag.getTags.invalidate({userId: sessionData?.user?.id});
    }
  })

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

  }

  const removeTodo = (id: string) => {
    deleteTodo.mutate({id: id});
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
                <h4 className="text-4xl">Create new question</h4>
                <form className="mt-1 space-y-2 w-1/2" onSubmit={(e) => handleSubmit(e)}>
                  <div className=" shadow-sm -space-y-px">
                    <div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setContent(e.target.value)}
                        className="appearance-none rounded-none relative block
                        w-full px-3 py-2 border border-gray-300
                        placeholder-gray-500 text-gray-900
                        focus:outline-none focus:ring-indigo-500
                        focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Tag name"
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="submit"
                      className="group relative w-full flex justify-center
                      py-2 px-4 border border-transparent text-sm font-medium
                      rounded-md text-white bg-indigo-600 hover:bg-indigo-700
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      focus:ring-indigo-500"
                    >
                      <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                        
                      </span>
                      Submit
                    </button>
                  </div>
                </form>
                <h4 className="text-4xl">Your questions list:</h4>
              </>
              
            )
          }
        })()}
        

      </div>
    </>
    
  );
};

export default Tags;