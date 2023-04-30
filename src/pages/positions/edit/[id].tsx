import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { PositionContent, PositionQuestion, Question, QuestionContent, QuestionTag, Tag } from "@prisma/client";
import { PositionQuestionDetails } from "~/utils/PositionQuestionsDetails";
import { SearchQuestionDetails } from "~/utils/searchQuestionDetails";

const PositionEdit: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: sessionData } = useSession({ required: true,
    onUnauthenticated() {
        void signIn();
    },});

  
  const [existingQuestions, setExistingQuestions] = useState<PositionQuestionDetails[]>([]);
  const [searchQuestions, setSearchQuestions] = useState<SearchQuestionDetails[]>([]);
  const pageSize = 10;
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPage, setTotalPage] = useState(0);
  
  const { data: position} = api.position.getPositionDetails.useQuery({ id: id as string });
  const updatePosition = api.position.update.useMutation({});
  const addQuestionToPosition = api.question.addQuestionPosition.useMutation({
    onSuccess: () => {
        void ctx.position.getPositionDetails.invalidate({ id: id as string });
    }
  });
  const deleteQuestionPosition = api.question.removeQuestionPosition.useMutation({
    onSuccess: () => {
        void ctx.position.getPositionDetails.invalidate({ id: id as string });
    }
  });
  const ctx = api.useContext();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  

  const [searchTag, setSearchTag] = useState("");
  const [search, setSearch] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const { data: tags } = api.tag.searchTags.useQuery({ text: searchTag });

  const { data: searchQuestionsResult} = api.question.searchQuestions.useQuery({ text: question, tagId: search, pageSize: pageSize, pageIndex: pageIndex });

  const addTag = (tagName: string) => {
      if(!search.includes(tagName) && tagName !== ""){
          let newSearch = search.join(" ");
          newSearch = `${newSearch} ${tagName}`;
          const newArray = newSearch.split(" ").filter(c => c != "");
          setSearch(newArray);
      }
      
  }
  const removeTag = (tagName:string) => {
      const newArray = search.filter(c => c != tagName);
      setSearch(newArray);
  }




  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    updatePosition.mutate({id: position?.id as string, title: title, description: content });
  }
  const handleSubmitSearchQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void ctx.question.searchQuestions.invalidate({ text: question, tagId: search, pageSize: pageSize, pageIndex: pageIndex });
    setSearchQuestions(searchQuestionsResult?.question as SearchQuestionDetails[]);
    const totalPageResult = searchQuestionsResult?.total;
    console.log(totalPageResult);
    if (totalPageResult) {
      console.log(totalPageResult);
      const setTotalPageResult = Math.floor(totalPageResult / pageSize) + 1;
      console.log(setTotalPageResult)
      setTotalPage(setTotalPageResult);
   }
  }

  const goTo =(page:number) =>{
    setPageIndex(page - 1);
    void ctx.question.searchQuestions.invalidate({ text: question, tagId: search, pageSize: pageSize, pageIndex: pageIndex });
  }

  const addQuestion = (questionId: string) =>{
    addQuestionToPosition.mutate({ positionId: id as string, questionId: questionId});
  }

  const removeQuestion = (positionQuestionId: string) => {
    deleteQuestionPosition.mutate({ id: positionQuestionId});
  }
  useEffect(() => {
    setTitle(position?.title as string);
    setContent(position?.positionContent?.description as string);
    if (position?.positionQuestion){
      setExistingQuestions(position?.positionQuestion as PositionQuestionDetails[]);
    }
    setSearchQuestions(searchQuestionsResult?.question as SearchQuestionDetails[]);
    const totalPageResult = searchQuestionsResult?.total;
    if (totalPageResult) {
      const setTotalPageResult = Math.floor(totalPageResult / pageSize) + 1;
      setTotalPage(setTotalPageResult);
   }
    
  },[searchQuestionsResult?.question, pageIndex, position?.positionQuestion]);
  
  return (
    <>
      <div className="w-full flex flex-col items-center justify-center gap-4 text-white">
        {(() => {
          if (sessionData != null) {
            return (
              <>
              <div className="grid grid-cols-2 gap-4 w-full">
                <div>
                  <h4 className="text-4xl">Edit Position</h4>

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

                  <div className="mt-6">
                    <div className="w-full max-w-screen-xl mx-auto">
                      <div className="flex justify-center py-2">
                          <div className="w-full">
                              <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                                <form  onSubmit={(e) => handleSubmitSearchQuestion(e)}>
                                  <div className="block text-gray-700 text-lg font-semibold py-2 px-2">
                                      Search questions
                                  </div>
                                  <div className="flex items-center bg-gray-200 rounded-md">
                                      <div className="pl-2">
                                          <svg className="fill-current text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24">
                                              <path className="heroicon-ui"
                                                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                                          </svg>
                                      </div>
                                      <input
                                          value={question}
                                          onChange={(e) => setQuestion(e.target.value)}
                                          className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                                          type="text"
                                          placeholder="Search questions..." />
                                  </div>
                                  <br/>
                                  <div className="block text-gray-700 text-lg font-semibold py-2 px-2">
                                      Selected Tags ({search.length})
                                  </div>
                                  <div className="flex items-center rounded-md">
                                      {search?.map(function(item, i){
                                          return (
                                              <button 
                                              onClick={() => removeTag(item)}
                                              key={i} 
                                              className="py-2 px-4 bg-black shadow-md no-underline rounded-full bg-blue text-white font-sans font-semibold text-sm border-blue btn-primary hover:text-white hover:bg-blue-light focus:outline-none active:shadow-none mr-2">
                                                  {item}
                                              </button>
                                          )
                                      })}
                                  </div>
                                  <div className="block text-gray-700 text-lg font-semibold py-2 px-2">
                                      Search Tags
                                  </div>
                                  <div className="flex items-center bg-gray-200 rounded-md">
                                      <div className="pl-2">
                                          <svg className="fill-current text-gray-500 w-6 h-6" xmlns="http://www.w3.org/2000/svg"
                                              viewBox="0 0 24 24">
                                              <path className="heroicon-ui"
                                                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
                                          </svg>
                                      </div>
                                      <input
                                          value={searchTag}
                                          onChange={(e) => setSearchTag(e.target.value)}
                                          className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                                          type="text"
                                          placeholder="Search questions by tags" />
                                  </div>
                                  <div className="py-3 text-sm">
                                  {tags?.map(function(item, i){
                                      return (
                                      <div key={i} onClick={() => addTag(item.name)} className="flex justify-start cursor-pointer text-gray-700 hover:text-blue-400 hover:bg-blue-100 rounded-md px-2 py-2 my-2">
                                          <span className="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
                                          <div className="flex-grow font-medium px-2">{item.name}</div>
                                      </div>
                                      )
                                  })}
                                  </div>

                                  
                                  <div className="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
                                      <button 
                                      onClick={() => setSearch([])}
                                      className="hover:text-gray-600 text-gray-500 font-bold py-2 px-4 ">
                                          Clear
                                      </button>
                                      <button type="submit"
                                      disabled={search.length === 0 && question === ""}
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                                          Search
                                      </button>
                                  </div>
                                </form>
                              </div>

                              <div>
                                {searchQuestions?.map(function(item,i){
                                  return (
                                  <>
                                    <div key={i} className="bg-white rounded shadow border p-6 w-full mb-2">
                                      <h5 className="text-gray-700 text-3xl mb-4 mt-0">{item.title}</h5>
                                      <button 
                                      onClick={() => addQuestion(item.id)}
                                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                                        Add question
                                      </button>
                                    </div>
                                  </>
                                  )
                                })}
                              </div>



                              <div className="container mx-auto px-4">
                                <nav className="flex flex-row flex-nowrap justify-between md:justify-center items-center" aria-label="Pagination">
                                  {pageIndex > 0 && 
                                    <a onClick={() => goTo(pageIndex - 1)} className="flex w-10 h-10 mr-1 justify-center items-center rounded-full border border-gray-200 bg-white text-black hover:border-gray-300" href="#" title="Previous Page">
                                        <span className="sr-only">Previous Page</span>
                                        <svg className="block w-4 h-4 fill-current" viewBox="0 0 256 512" aria-hidden="true" role="presentation">
                                            <path d="M238.475 475.535l7.071-7.07c4.686-4.686 4.686-12.284 0-16.971L50.053 256 245.546 60.506c4.686-4.686 4.686-12.284 0-16.971l-7.071-7.07c-4.686-4.686-12.284-4.686-16.97 0L10.454 247.515c-4.686 4.686-4.686 12.284 0 16.971l211.051 211.05c4.686 4.686 12.284 4.686 16.97-.001z"></path>
                                        </svg>
                                    </a>
                                  }
                                  
                                  {Array.apply(0, Array(totalPage)).map(function (x, i) {
                                    return (
                                      <a key={i} onClick={() => goTo(i)}  className="hidden md:flex w-10 h-10 mx-1 justify-center items-center rounded-full border border-gray-200 bg-white text-black hover:border-gray-300" href="#" title="Page 1">
                                        {i + 1}
                                    </a>
                                    );
                                  })}

                                  {pageIndex < (totalPage - 1) && 
                                      <a onClick={() => goTo(pageIndex + 1)} className="flex w-10 h-10 ml-1 justify-center items-center rounded-full border border-gray-200 bg-white text-black hover:border-gray-300" href="#" title="Next Page">
                                        <span className="sr-only">Next Page</span>
                                          <svg className="block w-4 h-4 fill-current" viewBox="0 0 256 512" aria-hidden="true" role="presentation">
                                              <path d="M17.525 36.465l-7.071 7.07c-4.686 4.686-4.686 12.284 0 16.971L205.947 256 10.454 451.494c-4.686 4.686-4.686 12.284 0 16.971l7.071 7.07c4.686 4.686 12.284 4.686 16.97 0l211.051-211.05c4.686-4.686 4.686-12.284 0-16.971L34.495 36.465c-4.686-4.687-12.284-4.687-16.97 0z"></path>
                                          </svg>
                                      </a>
                                  }
                                </nav>
                              </div>
                          </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-4xl mb-4">
                    Existing Questions
                  </h4>
                  {existingQuestions?.map(function(item, i){
                    return (
                    <div key={i} className="mb-4">
                      
                      <div>
                        {i + 1}/ {item.question.title}
                        <span onClick={() => removeQuestion(item.id)} className="text-red-400 cursor-pointer">x</span>
                      </div>
                      <div>
                        {item.question.questionContent?.content}
                      </div>
                      
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


export default PositionEdit;