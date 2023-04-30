
import { Tag } from "@prisma/client";
import Link from "next/link";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { api } from "~/utils/api";


export const SearchBar = () => {
    type SearchPosition = {
        positionContent: {
            description: string;
        } | null;
        id: string;
        title: string;
    };
    const [position, setPosition] = useState("");
    const [searchKeyWord, setSearchKeyWord] = useState("");
    const ctx = api.useContext();

    const {data: positions } = api.position.searchPositions.useQuery({text: searchKeyWord });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSearchKeyWord(position);
        void ctx.position.searchPositions.invalidate({text: searchKeyWord});
    }
    


    return (
        <>
            <div className="w-full max-w-screen-xl mx-auto px-6">
                <div className="flex justify-center p-4 px-3 py-2">
                    <div className="w-full">
                        <div className="bg-white shadow-md rounded-lg px-3 py-2 mb-4">
                            <form  onSubmit={(e) => handleSubmit(e)}>
                                <div className="block text-gray-700 text-lg font-semibold py-2 px-2">
                                    Search positions
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
                                        value={position}
                                        onChange={(e) => setPosition(e.target.value)}
                                        className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                                        type="text"
                                        placeholder="Search questions..." />
                                </div>
                                <br/>
                                <div className="block bg-gray-200 text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
                                    <button type="submit"
                                    disabled={position === ""}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50">
                                        Search
                                    </button>
                                </div>
                            </form>
                            
                        </div>

                        <div>
                            {positions?.length as number > 0 && 
                                <div className="text-center mb-3">
                                    <h4 className="text-4xl">Results</h4>
                                </div>
                            }
                            {positions?.map(function(item, i){
                                return (
                                    <div key={i} className="bg-gray-200 rounded shadow border p-6 w-full mb-2">
                                        <h5 className="text-gray-700 text-3xl mb-4 mt-0">{item.title}</h5>
                                        <div className="block text-sm text-right py-2 px-3 -mx-3 -mb-2 rounded-b-lg">
                                            <Link 
                                            href={`/positions/view/${item.id}`}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50 text-right">
                                                View
                                            </Link>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </>
        
    )
}
