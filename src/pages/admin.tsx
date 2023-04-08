// pages/admin.tsx
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { signOut, signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

const AdminPage = () => {
    const router = useRouter();
    const { data: sessionData } = useSession({ required: true,
        onUnauthenticated() {
            void signIn();
        },});

    useEffect(() => {
        if(sessionData?.user?.role != "admin"){
            router.push("/403");
        }
    }, []);
    return (
        
        <div className="bg-gradient-to-b from-[#2e026d] to-[#15162c]">
            <div className="grid place-content-center min-h-screen">
                <div className="flex flex-col gap-4">
                <h1 className="text-4xl text-white">Admin Page</h1>
                <p className="text-xl text-white">You are admin</p>
                <Link className="btn btn-primary text-white" href="/">
                    Go to Index Page
                </Link>
                {(() => {
                    if (sessionData?.user.role == "admin") {
                    return (
                        <button
                        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                        onClick={() => void signOut()}>
                            Sign out
                        </button>
                    )
                    }
                })()}
                
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
