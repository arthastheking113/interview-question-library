import React, { PropsWithChildren } from "react";
import { HomeNavigation } from "../homeNavigation";

//this is the main layout
//if you want to have multiple layout
//check out: https://www.codeconcisely.com/posts/nextjs-multiple-layouts/
const MainLayout = ({ children }: PropsWithChildren) => {
return (
    <>
        <HomeNavigation/>
        <main className="flex min-h-screen flex-col items-center  bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
                {children}
            </div>
        </main>
    </>
    
);
};
export default MainLayout;