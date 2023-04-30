import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FormEvent, useState } from "react";
import { useRouter } from "next/router";
import { MDEditor } from "~/components/markdownEditor";

const PositionCreate: NextPage = () => {
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});

    
  const ctx = api.useContext();
  const router = useRouter();

  const createPosition = api.position.create.useMutation({
    onSuccess: (data) => {
      setTitle("");
      setContent("");
      void router.push(`/positions/edit/${data.id}`);
    }
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    createPosition.mutate({title: title, description: content, userId: sessionData?.user?.id as string});
  }

  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
                <h4 className="text-4xl">
                  Create new position
                </h4>
                <form className="mt-1 space-y-2 w-full" onSubmit={(e) => handleSubmit(e)}>
                  <div className=" shadow-sm -space-y-px">
                    <div>
                      <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="appearance-none rounded-none relative block
                        w-full px-3 py-2 border border-gray-300
                        placeholder-gray-500 text-gray-900
                        focus:outline-none focus:ring-indigo-500
                        focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Position title"
                      />
                    </div>
                  </div>
                  <div className="shadow-sm -space-y-px mt-6 pt-6">
                    <div>
                      <MDEditor height={500} value={content} onChange={(e) => setContent(e as string)} />
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
              </>
            )
          }
        })()}

      </div>
    </>
    
  );
};

export default PositionCreate;