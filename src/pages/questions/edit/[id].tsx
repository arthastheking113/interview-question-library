import { type NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Option } from "~/utils/selectOptions";
import { QuestionTag, Tag } from "@prisma/client";

const QuestionsEdit: NextPage = () => {
  const ctx = api.useContext();
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});
  const { data: question} = api.question.getQuestionDetails.useQuery({ id: id as string });
  const { data: tagOptions} = api.tag.getTagDropdown.useQuery();
  
  const tagList = question?.tags as (QuestionTag & { tag: Tag; })[];
  const tagCount = tagList?.length;
  const selectedOptions:Option[] = [];

  for (let index = 0; index < tagCount; index++) {
    const questionTag = tagList[index] as (QuestionTag & {tag: Tag;});


    selectedOptions.push({ label: questionTag.tag.name, value: questionTag.tag.id});
  }

  useEffect(() => {
    setTitle(question?.title as string);
    setContent(question?.questionContent?.content as string);
    setSelectedValue(selectedOptions);
    setOption(tagOptions as Option[]);
  },[]);

  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      void ctx.question.getQuestions.invalidate({userId: sessionData?.user?.id as string});
    }
  })

  const updateQuestion = api.question.update.useMutation({});

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  
  const [options, setOption] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState<Option[]>([]);
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const count = selectedValue?.length;

    const tagIdList: string[] = [];
    
    for (let index = 0; index < count; index++) {
      const tag = selectedValue[index];
      tagIdList.push(tag?.value as string);
    }
    updateQuestion.mutate({id: question?.id as string, title: title, content: content, tagsId: tagIdList });
  }

  const handleSubmitAnswer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //updateQuestion.mutate({id: question?.id as string, title: title, content: content });
  }

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
                <h4 className="text-4xl">
                  Edit question
                </h4>
                <form className="mt-1 space-y-2 w-1/2" onSubmit={(e) => handleSubmit(e)}>
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
                        placeholder="Question title"
                      />
                    </div>
                  </div>
                  <div className=" shadow-sm -space-y-px">
                    <div>
                      <textarea
                        required
                        rows={10}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="appearance-none rounded-none relative block
                        w-full px-3 py-2 border border-gray-300
                        placeholder-gray-500 text-gray-900
                        focus:outline-none focus:ring-indigo-500
                        focus:border-indigo-500 focus:z-10 sm:text-sm"
                        placeholder="Question Content"
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
                      Update
                    </button>
                  </div>
                </form>
              </>
            )
          }
        })()}
        
        <h4 className="text-4xl mt-4">Add answer</h4>
        <form className="mt-1 space-y-2 w-1/2" onSubmit={(e) => handleSubmitAnswer(e)}>
          <div className=" shadow-sm -space-y-px">
            <div>
              <textarea
                required
                rows={10}
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="appearance-none rounded-none relative block
                w-full px-3 py-2 border border-gray-300
                placeholder-gray-500 text-gray-900
                focus:outline-none focus:ring-indigo-500
                focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Question Content"
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
              Add
            </button>
          </div>
        </form>

      </div>
    </>
    
  );
};


export default QuestionsEdit;