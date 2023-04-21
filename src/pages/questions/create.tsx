import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import  Select, { ActionMeta, GroupBase, MultiValue, OnChangeValue, OptionsOrGroups }  from 'react-select';
import { Option } from "~/utils/selectOptions";
import makeAnimated from 'react-select/animated';
const QuestionsCreate: NextPage = () => {
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});

  const { data: tagOptions} = api.tag.getTagDropdown.useQuery();
    
  const ctx = api.useContext();
  const router = useRouter();
  const animatedComponents = makeAnimated();
  const createQuestion = api.question.create.useMutation({
    onSuccess: (data) => {
      setTitle("");
      setContent("");
      setError("");
      void router.push(`/questions/edit/${data.id}`);
    }
  });


  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const showError = () =>{
    setError("You need to select at least 1 tag");
  }
  const [options, setOption] = useState<Option[]>([]);
  const [selectedValue, setSelectedValue] = useState<Option[]>([]);
  
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const count = selectedValue?.length;
    console.log(count);
    if(count > 0){
      const tagIdList: string[] = [];
    
      for (let index = 0; index < count; index++) {
        const tag = selectedValue[index];
        tagIdList.push(tag?.value as string);
      }
      createQuestion.mutate({title: title, content: content, userId: sessionData?.user?.id as string, tagsId: tagIdList});
    }else{
      showError();
      console.log(error);
    }
    
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
    console.log(error);
    setOption(tagOptions as Option[]);
  },[error, tagOptions]);
  
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
                <h4 className="text-4xl">
                  Create new question
                </h4>
                <h4 className="text-red-600">{error}</h4>
                <Select
                  className="w-1/2 text-gray-900"
                  components={animatedComponents}
                  value={selectedValue}
                  isMulti={true}
                  closeMenuOnSelect={false}
                  options={options}
                  onChange={onSelectValue}
                  placeholder={"Select tags..."}
                />
                
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

export default QuestionsCreate;