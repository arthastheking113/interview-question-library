import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export const HomeNavigation = () => {
    const { data: sessionData } = useSession();
    return (
        <div className="w-full max-w-screen-xl mx-auto px-6">
            <div className="flex justify-center px-3">
                <div className="w-full">
                    <div className="rounded-lg px-3">
                        <ul
                        className="flex list-none flex-col flex-wrap pl-0 md:flex-row"
                        role="tablist"
                        data-te-nav-ref>
                            <li role="presentation" className="flex-auto text-center">
                                <Link
                                href="/"
                                
                                className="my-2 block rounded px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight bg-white/10 p-4 hover:bg-white/20 md:mr-4"
                                
                                >Home </Link>
                            </li>
                            {sessionData &&
                                <>
                                    <li role="profile" className="flex-auto text-center">
                                        <Link
                                        href="/positions"
                                        className="my-2 block rounded px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight bg-white/10 p-4 hover:bg-white/20 md:mr-4"

                                        >Positions</Link>
                                    </li>
                                    <li role="profile" className="flex-auto text-center">
                                        <Link
                                        href="/questions"
                                        className="my-2 block rounded px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight bg-white/10 p-4 hover:bg-white/20 md:mr-4"

                                        >Questions</Link>
                                    </li>
                                    <li role="contact" className="flex-auto text-center">
                                        <Link
                                        href="/tags"
                                        className="my-2 block rounded px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight bg-white/10 p-4 hover:bg-white/20 md:mr-4"

                                        >Tags</Link>
                                    </li>
                                </>
                            }
                            
                            <li role="contact" className="flex-auto text-center">
                                <a
                                onClick={sessionData ? () => void signOut() : () => void signIn()}
                                
                                className="my-2 block rounded px-7 pb-3.5 pt-4 text-xs font-medium uppercase leading-tight bg-white/10 p-4 hover:bg-white/20 md:mr-4 cursor-pointer">
                                    {sessionData ? "Sign out" : "Sign in"}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
