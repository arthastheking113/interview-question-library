import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { Answer, QuestionTag, Tag } from "@prisma/client";
import  Select, { ActionMeta, GroupBase, MultiValue, OnChangeValue, OptionsOrGroups }  from 'react-select';
import { Option } from "~/utils/selectOptions";
import makeAnimated from 'react-select/animated';
import { MDEditor } from "~/components/markdownEditor";
import { ViewMarkDown } from "~/components/viewMarkDown";

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
  
  const animatedComponents = makeAnimated();
  const tagList = question?.tags as (QuestionTag & { tag: Tag; })[];
  const tagCount = tagList?.length;
  const selectedOptions:Option[] = [];

  for (let index = 0; index < tagCount; index++) {
    const questionTag = tagList[index] as (QuestionTag & {tag: Tag;});


    selectedOptions.push({ label: questionTag.tag.name, value: questionTag.tag.id});
  }


  const deleteQuestion = api.question.delete.useMutation({
    onSuccess: () => {
      void ctx.question.getQuestions.invalidate({userId: sessionData?.user?.id as string});
    }
  })
  const deleteAnswer = api.answer.delete.useMutation({
    onSuccess: () => {
      void ctx.question.getQuestionDetails.invalidate({ id: id as string });
    }
  })
  
  const onClickDeleteAnswer = (id: string) => {
    deleteAnswer.mutate({id: id});
  }

  const createAnswer = api.answer.create.useMutation({
    onSuccess: () => {
      void ctx.question.getQuestionDetails.invalidate({ id: id as string });
      setExistingAnswers(question?.answer as Answer[]);
      setAnswer("");
    }
  })

  const updateQuestion = api.question.update.useMutation({});

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [answer, setAnswer] = useState("");
  
  const [options, setOption] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState<Option[]>([]);
  const [existingAnswers, setExistingAnswers] = useState<Answer[]>([]);
  
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
    createAnswer.mutate({userId: sessionData?.user?.id as string, content: answer, questionId: question?.id as string});
  }

  const removeQuestion = (id: string) => {
    deleteQuestion.mutate({id: id});
  }
  const onSelectValue = (option: MultiValue<Option>, actionMeta: ActionMeta<Option>) => {
    const value: Option[] = [];

    for (let index = 0; index < option.length; index++) {
      const element = option[index] as Option;
      value.push(element);
    }
    setSelectedValue(value);
  }

  useEffect(() => {
    setTitle(question?.title as string);
    setContent(question?.questionContent?.content as string);
    setSelectedValue(selectedOptions);
    setOption(tagOptions as Option[]);
    setExistingAnswers(question?.answer as Answer[]);
  },[question?.answer]);
  return (
    <>
    <div className="w-full">
      <h4 className="text-4xl text-white">
              Edit question
      </h4>
      <Select
        className="w-full text-gray-900 mt-4"
        components={animatedComponents}
        value={selectedValue}
        isMulti={true}
        closeMenuOnSelect={false}
        options={options}
        onChange={onSelectValue}
        placeholder={"Select tags..."}
      />
      <form className="space-y-2 w-full mt-4" onSubmit={(e) => handleSubmit(e)}>
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
        <div className=" shadow-sm -space-y-px mt-4 pt-4">
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
            Update
          </button>
        </div>
      </form>
    </div>
    <div className="w-full">
      <div>
        <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
          
          
          <h4 className="text-4xl mt-4">Add answer</h4>
          
          <form className="mt-1 space-y-2 w-full" onSubmit={(e) => handleSubmitAnswer(e)}>
            <div className=" shadow-sm -space-y-px">
              <div>
                <MDEditor height={500} value={answer} onChange={(e) => setAnswer(e as string)} />
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
      </div>
      
      <div>
      <div className="w-full text-white mt-4">
        <h4 className="text-4xl mb-4">
          Existing Answers
        </h4>
        {existingAnswers?.map(function(item, i){
          return (
          <div key={i} className="">
            <button
              onClick={() => onClickDeleteAnswer(item.id)}
              type="button"
              className="group relative flex justify-center
              py-2 px-4 border border-transparent text-sm font-medium
              rounded-md text-white bg-red-600 hover:bg-red-700
              focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-indigo-500"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                
              </span>
              Delete
            </button>
            <div className="my-2">
              {i+1}/
              <ViewMarkDown value={item.content} ></ViewMarkDown>
            </div>
          </div>
          )
        })}
          
        </div>
      </div>
    </div>
      
    </>
    
  );
};


export default QuestionsEdit;