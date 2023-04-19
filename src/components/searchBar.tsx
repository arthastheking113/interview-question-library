
import { Tag } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import { api } from "~/utils/api";


export const SearchBar = () => {

    const [content, setContent] = useState("");
    const [search, setSearch] = useState<string[]>([]);
    const [question, setQuestion] = useState("");
    const { data: tags } = api.tag.searchTags.useQuery({ text: content });

    const ctx = api.useContext();

    

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

    return (
        <>
            <div className="w-full max-w-screen-xl mx-auto px-6">
                <div className="flex justify-center p-4 px-3 py-2">
                    <div className="w-full max-w-md">
                        <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                            
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
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
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
                                    {/* <div className="text-sm font-normal text-gray-500 tracking-wide">Team</div> */}
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
                                <button 
                                disabled={search.length === 0 && question === ""}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}
